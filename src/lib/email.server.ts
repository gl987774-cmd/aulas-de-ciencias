import nodemailer from "nodemailer";

export async function sendAccessEmail(data: {
  email: string;
  name: string;
  planName: string;
  accessUrl: string;
}): Promise<boolean> {
  const host = process.env.SMTP_HOST || process.env.EMAIL_SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || process.env.EMAIL_SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER || process.env.EMAIL_SMTP_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_SMTP_PASS;
  const from = process.env.EMAIL_FROM || process.env.SMTP_FROM || "noreply@bioatividades.com";

  // Try SMTP first
  if (host && user && pass) {
    try {
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });

      await transporter.sendMail({
        from: `"BioAtividades" <${from}>`,
        to: data.email,
        subject: `Seu acesso ao ${data.planName} foi liberado! 🎉`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
            <h2 style="color:#006904">Parabéns pela sua compra! 🎉</h2>
            <p>Olá, <strong>${data.name}</strong>!</p>
            <p>Recebemos seu pagamento e seu acesso ao <strong>${data.planName}</strong> já está disponível.</p>
            <a href="${data.accessUrl}"
               style="display:inline-block;padding:14px 32px;margin:16px 0;
                      background:linear-gradient(135deg,#006904,#1f8b2f);color:#fff;
                      border-radius:12px;text-decoration:none;font-weight:bold;font-size:16px">
              👉 Acessar meu produto
            </a>
            <p style="color:#6b7280;font-size:14px">
              Se tiver qualquer dúvida, basta responder este e-mail.
            </p>
            <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0" />
            <p style="color:#9ca3af;font-size:12px">
              BioAtividades — Todos os direitos reservados.
            </p>
          </div>
        `,
      });

      console.log("[EMAIL] Enviado via SMTP para", data.email);
      return true;
    } catch (err) {
      console.error("[EMAIL] Erro SMTP:", err);
      // Fall through to Resend fallback
    }
  }

  // Fallback: Resend API
  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          from: from,
          to: data.email,
          subject: `Seu acesso ao ${data.planName} foi liberado! 🎉`,
          html: `
            <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
              <h2 style="color:#006904">Parabéns pela sua compra! 🎉</h2>
              <p>Olá, <strong>${data.name}</strong>!</p>
              <p>Recebemos seu pagamento e seu acesso ao <strong>${data.planName}</strong> já está disponível.</p>
              <a href="${data.accessUrl}"
                 style="display:inline-block;padding:14px 32px;margin:16px 0;
                        background:linear-gradient(135deg,#006904,#1f8b2f);color:#fff;
                        border-radius:12px;text-decoration:none;font-weight:bold;font-size:16px">
                👉 Acessar meu produto
              </a>
              <p style="color:#6b7280;font-size:14px">
                Se tiver qualquer dúvida, basta responder este e-mail.
              </p>
              <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0" />
              <p style="color:#9ca3af;font-size:12px">
                BioAtividades — Todos os direitos reservados.
              </p>
            </div>
          `,
        }),
      });

      if (res.ok) {
        console.log("[EMAIL] Enviado via Resend para", data.email);
        return true;
      }
      const err = await res.text();
      console.error("[EMAIL] Erro Resend:", err);
    } catch (err) {
      console.error("[EMAIL] Falha Resend:", err);
    }
  }

  console.log("[EMAIL] Nenhum método configurado. Para SMTP, defina:");
  console.log("  SMTP_HOST, SMTP_USER, SMTP_PASS");
  console.log("  Ou para Resend: RESEND_API_KEY");
  return false;
}

export function buildAccessUrl(requestHost: string, token: string): string {
  const protocol = requestHost.includes("localhost") ? "http" : "https";
  return `${protocol}://${requestHost}/acesso?token=${token}`;
}
