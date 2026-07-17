import { createServerFn } from "@tanstack/react-start";
import { createOrder, getOrderByToken, confirmOrder as storeConfirmOrder, markEmailSent } from "./store.server";
import { sendAccessEmail, buildAccessUrl } from "./email.server";
import { sendWhatsAppMessage, buildWhatsAppLink } from "./whatsapp.server";

export interface PixPaymentData {
  id: number;
  qrCodeBase64: string;
  qrCodeText: string;
  status: string;
}

export const createPixPayment = createServerFn({ method: "POST" })
  .validator((d: unknown) => {
    const data = d as { planName: string; amount: number; email: string };
    if (!data.email?.includes("@")) throw new Error("Email inválido");
    if (!data.amount || data.amount <= 0) throw new Error("Valor inválido");
    return data;
  })
  .handler(async ({ data }) => {
    const token = process.env.MERCADO_PAGO_ACCESS_TOKEN;
    if (!token) {
      throw new Error(
        "Mercado Pago não configurado. Configure MERCADO_PAGO_ACCESS_TOKEN nas variáveis de ambiente."
      );
    }

    const response = await fetch("https://api.mercadopago.com/v1/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-Idempotency-Key": crypto.randomUUID(),
      },
      body: JSON.stringify({
        transaction_amount: data.amount,
        description: `BioAtividades - ${data.planName}`,
        payment_method_id: "pix",
        payer: { email: data.email },
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Falha ao gerar pagamento PIX");
    }

    const payment = await response.json();

    return {
      id: payment.id,
      qrCodeBase64: payment.point_of_interaction.transaction_data.qr_code_base64,
      qrCodeText: payment.point_of_interaction.transaction_data.qr_code,
      status: payment.status,
    } satisfies PixPaymentData;
  });

export const checkPixStatus = createServerFn({ method: "POST" })
  .validator((d: unknown) => {
    const data = d as { paymentId: number };
    if (!data.paymentId) throw new Error("ID do pagamento é obrigatório");
    return data;
  })
  .handler(async ({ data }) => {
    const token = process.env.MERCADO_PAGO_ACCESS_TOKEN;
    if (!token) {
      throw new Error("Mercado Pago não configurado");
    }

    const response = await fetch(
      `https://api.mercadopago.com/v1/payments/${data.paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Falha ao verificar status do pagamento");
    }

    const payment = await response.json();
    return { status: payment.status as string };
  });

export const confirmPurchase = createServerFn({ method: "POST" })
  .validator((d: unknown) => {
    const data = d as {
      paymentId: number;
      email: string;
      phone: string;
      name: string;
      planName: string;
      amount: number;
      whatsappDelivery: boolean;
    };
    if (!data.paymentId) throw new Error("ID do pagamento é obrigatório");
    if (!data.email?.includes("@")) throw new Error("Email inválido");
    return data;
  })
  .handler(async ({ data }) => {
    const host = process.env.SITE_URL || "localhost:3000";

    const order = createOrder({
      paymentId: data.paymentId,
      email: data.email,
      phone: data.phone,
      name: data.name,
      planName: data.planName,
      amount: data.amount,
      whatsappDelivery: data.whatsappDelivery,
    });

    storeConfirmOrder(data.paymentId);

    const accessUrl = buildAccessUrl(host, order.accessToken);

    const emailSent = await sendAccessEmail({
      email: data.email,
      name: data.name,
      planName: data.planName,
      accessUrl,
    });

    if (emailSent) {
      markEmailSent(data.paymentId);
    }

    let whatsappSent = false;
    let whatsappLink = "";
    if (data.whatsappDelivery && data.phone) {
      whatsappSent = await sendWhatsAppMessage({
        phone: data.phone,
        name: data.name,
        planName: data.planName,
        accessUrl,
      });
      if (!whatsappSent) {
        whatsappLink = buildWhatsAppLink(data.phone, accessUrl, data.name, data.planName);
      }
    }

    return { accessToken: order.accessToken, accessUrl, emailSent, whatsappSent, whatsappLink };
  });

export const getAccessData = createServerFn({ method: "POST" })
  .validator((d: unknown) => {
    const data = d as { token: string };
    if (!data.token) throw new Error("Token inválido");
    return data;
  })
  .handler(async ({ data }) => {
    const order = getOrderByToken(data.token);
    if (!order) return null;
    if (!order.paid) return null;
    return {
      name: order.name,
      email: order.email,
      planName: order.planName,
      amount: order.amount,
      paidAt: order.paidAt,
      whatsappDelivery: order.whatsappDelivery,
      phone: order.phone,
    };
  });
