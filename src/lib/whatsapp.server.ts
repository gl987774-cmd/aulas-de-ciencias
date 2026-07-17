export async function sendWhatsAppMessage(data: {
  phone: string;
  name: string;
  planName: string;
  accessUrl: string;
}): Promise<boolean> {
  const apiKey = process.env.ZAPI_TOKEN;
  const instanceId = process.env.ZAPI_INSTANCE_ID;

  if (!apiKey || !instanceId) return false;

  const phoneClean = data.phone.replace(/\D/g, "");

  try {
    const res = await fetch(
      `https://api.z-api.io/instances/${instanceId}/token/${apiKey}/send-text`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: phoneClean,
          message: `🎉 *Parabéns, ${data.name}!* Seu acesso ao *${data.planName}* foi liberado!\n\nAcesse aqui: ${data.accessUrl}\n\nBom aproveitamento! 🚀`,
        }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error("[WHATSAPP] Erro Z-API:", err);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[WHATSAPP] Falha no envio:", err);
    return false;
  }
}

export function buildWhatsAppLink(phone: string, accessUrl: string, name: string, planName: string): string {
  const msg = encodeURIComponent(
    `🎉 Parabéns, ${name}! Seu acesso ao ${planName} foi liberado!\n\nAcesse aqui: ${accessUrl}\n\nBom aproveitamento! 🚀`
  );
  return `https://wa.me/55${phone.replace(/\D/g, "")}?text=${msg}`;
}
