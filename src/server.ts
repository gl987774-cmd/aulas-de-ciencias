import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

// Webhook handler for Mercado Pago
async function handlePixWebhook(request: Request): Promise<Response> {
  try {
    const body = await request.json() as { action?: string; data?: { id?: number } };
    const paymentId = body?.data?.id;
    if (!paymentId) {
      return new Response(JSON.stringify({ error: "missing payment id" }), { status: 400 });
    }

    const token = process.env.MERCADO_PAGO_ACCESS_TOKEN;
    if (!token) {
      return new Response(JSON.stringify({ error: "MP not configured" }), { status: 500 });
    }

    const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!mpRes.ok) {
      return new Response(JSON.stringify({ error: "failed to fetch payment" }), { status: 502 });
    }

    const payment = await mpRes.json();
    if (payment.status !== "approved") {
      return new Response(JSON.stringify({ received: true, status: payment.status }), { status: 200 });
    }

    // Dynamically import store + email to avoid blocking SSR startup
    const { getOrderByPayment, confirmOrder, markEmailSent } = await import("./lib/store.server");
    const { sendAccessEmail, buildAccessUrl } = await import("./lib/email.server");

    const existing = getOrderByPayment(paymentId);
    if (!existing) {
      return new Response(JSON.stringify({ received: true, note: "order not found (polling will handle)" }), { status: 200 });
    }

    if (existing.paid) {
      return new Response(JSON.stringify({ received: true, note: "already paid" }), { status: 200 });
    }

    confirmOrder(paymentId);

    const host = process.env.SITE_URL || "localhost:3000";
    const accessUrl = buildAccessUrl(host, existing.accessToken);

    const emailSent = await sendAccessEmail({
      email: existing.email,
      name: existing.name,
      planName: existing.planName,
      accessUrl,
    });

    if (emailSent) {
      markEmailSent(paymentId);
    }

    return new Response(JSON.stringify({ received: true, confirmed: true, emailSent }), { status: 200 });
  } catch (err) {
    console.error("[WEBHOOK] Error:", err);
    return new Response(JSON.stringify({ error: "internal error" }), { status: 500 });
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const url = new URL(request.url);
      if (url.pathname === "/api/pix-webhook" && request.method === "POST") {
        return handlePixWebhook(request);
      }

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
