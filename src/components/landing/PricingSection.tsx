import { useEffect } from "react";
import { Check, ShoppingCart } from "lucide-react";

const basicFeatures = [
  "150 dinâmicas de Ciências prontas para uso",
  "Acesso 100% digital liberado após a compra",
  "Material pronto para assistir, imprimir e aplicar",
  "Conteúdos organizados com base na BNCC",
  "Garantia incondicional de 7 dias",
];

const premiumFeatures = [
  "Mais de 500 dinâmicas de Ciências completas",
  "Acesso imediato e vitalício ao material",
  "Experimentos que fazem até a turma mais bagunceira prestar atenção.",
  "Conteúdos organizados com base na BNCC",
  "Guia de Educação Inclusiva: Autismo em sala de aula",
  "Pacote com 100 avaliações completas",
  "Guia prático para aulas mais dinâmicas",
  "Planejamento anual estruturado passo a passo",
  "Coleção com experimentos prontos",
  "Atendimento prioritário + Garantia de 7 dias",
];

export function PricingSection() {
  function openPix(plan: { name: string; amount: number; externalUrl?: string }) {
    if (plan.externalUrl) {
      window.open(plan.externalUrl, "_blank");
    }
  }

  function closeUpsell() {
    const overlay = document.getElementById("upsellOverlay");
    if (!overlay) return;
    overlay.classList.remove("show");
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  useEffect(() => {
    const overlay = document.getElementById("upsellOverlay");
    const closeBtn = document.getElementById("upsellClose");
    if (!overlay) return;
    function closeModal() {
      closeUpsell();
    }
    closeBtn?.addEventListener("click", closeModal);
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeModal();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && overlay.classList.contains("show")) closeModal();
    });
    return () => {
      closeBtn?.removeEventListener("click", closeModal);
    };
  }, []);
  return (
    <section id="pricing" className="bg-background px-4 py-14">
      <div className="container mx-auto max-w-5xl">
        <p className="text-center text-sm font-bold uppercase tracking-wide text-primary">
          Escolha seu plano
        </p>
        <h2 className="mt-2 text-center text-3xl font-bold text-foreground md:text-4xl">
          Um investimento que se paga em uma aula
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
          No Premium, cada dinâmica sai por menos de R$0,04 — e recupera horas do seu fim de
          semana.
        </p>

        <div className="mt-10 grid items-start gap-8 lg:grid-cols-2">
          {/* Basic */}
          <div className="rounded-2xl border border-border bg-card p-7 shadow-sm">
            <p className="font-heading text-lg font-bold text-foreground">Essencial</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Acesso completo ao pacote básico de dinâmicas de Ciências.
            </p>
            <div className="mt-5">
              <p className="text-sm text-muted-foreground">
                de <span className="line-through">R$ 47</span>
              </p>
              <p className="font-heading text-4xl font-extrabold text-foreground">R$ 10</p>
              <p className="text-xs text-muted-foreground">
                pagamento único · sem mensalidades
              </p>
            </div>
            <ul className="mt-6 space-y-2.5">
              {basicFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-foreground">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              id="btnEssencial"
              onClick={() => {
                const overlay = document.getElementById("upsellOverlay");
                if (overlay) {
                  overlay.classList.add("show");
                  overlay.setAttribute("aria-hidden", "false");
                  document.body.style.overflow = "hidden";
                }
              }}
              className="mt-7 w-full rounded-xl border-2 border-primary px-6 py-3.5 font-heading font-bold text-primary transition-colors hover:bg-secondary"
            >
              Quero o Básico
            </button>
          </div>

          {/* Premium */}
          <div className="relative rounded-2xl border-2 border-primary bg-card p-7 shadow-xl">
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-bold uppercase tracking-wide text-primary-foreground">
              ⭐ Mais escolhido
            </span>
            <p className="font-heading text-lg font-bold text-foreground">Premium</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Tudo do Essencial + bônus exclusivos e acesso vitalício.
            </p>
            <div className="mt-5">
              <p className="text-sm text-muted-foreground">
                de <span className="line-through">R$ 97</span>
              </p>
              <p className="font-heading text-5xl font-extrabold text-primary">R$ 27,90</p>
              <p className="text-xs text-muted-foreground">
                pagamento único · menos de R$0,04 por dinâmica
              </p>
            </div>

            <ul className="mt-6 space-y-2.5">
              {premiumFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm font-medium text-foreground">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => openPix({ name: "Premium", amount: 27.90, externalUrl: "https://ggcheckout.app/checkout/v2/MGdkhlWHNrT7TMH9M7jd" })}
              className="mt-7 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-6 py-4 font-heading font-bold uppercase tracking-wide text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
              style={{ background: "linear-gradient(135deg, #006904 0%, #1f8b2f 100%)" }}
            >
              <ShoppingCart className="h-5 w-5" />
              QUERO O PACOTE COMPLETO
            </button>
            <p className="mt-4 text-center text-xs text-muted-foreground">
              🔒 Pagamento 100% seguro · 🛡️ 7 dias de garantia incondicional
            </p>
          </div>
        </div>
      </div>

      {/* ===== Popup Upsell (Essencial -> Premium) ===== */}
      <div className="upsell-overlay" id="upsellOverlay" aria-hidden="true">
        <div className="upsell-modal" role="dialog" aria-modal="true" aria-labelledby="upsellTitle">
          <button type="button" className="upsell-close" id="upsellClose" aria-label="Fechar">✕</button>
          <span className="upsell-badge">🎁 Oferta exclusiva, só agora</span>
          <div className="upsell-icon">🚀</div>
          <h3 id="upsellTitle">Espera! Por só mais um pouco, leve o <span>Pacote Completo</span></h3>
          <p>Você está prestes a garantir o Essencial (150 dinâmicas). Mas por tempo limitado, dá pra destravar o <strong>Premium — mais de 500 dinâmicas, avaliações prontas, planejamento anual e acesso vitalício</strong> — pagando bem menos do que o valor normal.</p>
          <div className="upsell-price-box">
            <div className="upsell-price-row">
              <span className="upsell-old-price">de R$ 27,90</span>
              <span className="upsell-new-price">R$ 19,90<small> só nesta tela</small></span>
            </div>
            <span className="upsell-save">Você economiza R$ 8 e leva 3x mais conteúdo</span>
          </div>
          <ul className="upsell-benefits">
            <li>Mais de 500 dinâmicas em vez de 150</li>
            <li>100 avaliações prontas + planejamento anual completo</li>
            <li>Acesso vitalício com todas as atualizações futuras incluídas</li>
          </ul>
          <div className="upsell-actions">
            <button
              onClick={() => {
                closeUpsell();
                openPix({ name: "Premium (Oferta upsell)", amount: 19.90, externalUrl: "https://ggcheckout.app/checkout/v2/hV12xwguSspuTOvHnRku" });
              }}
              className="upsell-btn-accept"
              id="upsellAccept"
            >
              Sim! Quero o Completo por R$19,90 →
            </button>
            <button
              onClick={() => {
                closeUpsell();
                openPix({ name: "Essencial", amount: 10, externalUrl: "https://ggcheckout.app/checkout/v2/2ctXtprCPS0LXcEOCn5r" });
              }}
              className="upsell-btn-decline"
              id="upsellDecline"
            >
              Não, prefiro continuar só com o Essencial
            </button>
          </div>
          <div className="upsell-timer">⏳ Esta condição é exibida apenas uma vez</div>
        </div>
      </div>
    </section>
  );
}
