export async function sendAccessEmail(data: {
  email: string;
  name: string;
  planName: string;
  accessUrl: string;
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log("[EMAIL] Resend não configurado. Envio simulado:");
    console.log(`  Para: ${data.email}`);
    console.log(`  Assunto: Seu acesso ao ${data.planName} foi liberado!`);
    console.log(`  Link: ${data.accessUrl}`);
    return false;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || "onboarding@resend.dev",
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

    const ok = res.ok;
    if (!ok) {
      const err = await res.text();
      console.error("[EMAIL] Erro ao enviar:", err);
    }
    return ok;
  } catch (err) {
    console.error("[EMAIL] Falha no envio:", err);
    return false;
  }
}

export function buildAccessUrl(requestHost: string, token: string): string {
  const protocol = requestHost.includes("localhost") ? "http" : "https";
  return `${protocol}://${requestHost}/acesso?token=${token}`;
}
