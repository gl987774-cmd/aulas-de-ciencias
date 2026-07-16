import bonusScripts from "@/assets/landing/bonus-scripts.webp";
import bonusMiniManual from "@/assets/landing/bonus-mini-manual.webp";
import bonusAutoconhecimento from "@/assets/landing/bonus-autoconhecimento.webp";
import bonusEmocoes from "@/assets/landing/bonus-emocoes.webp";
import bonusSemExposicao from "@/assets/landing/bonus-sem-exposicao.webp";
import bonusImprimir from "@/assets/landing/bonus-imprimir.webp";

const bonuses = [
  {
    img: bonusAutoconhecimento,
    title: "Guia de Educação Inclusiva: Autismo em Sala de Aula",
    tag: "Mais procurado",
    desc: "Material completo com aulas, estratégias de comunicação, adaptação de atividades e orientações práticas para incluir alunos autistas no dia a dia da turma.",
    from: "R$ 49,00",
  },
  {
    img: bonusScripts,
    title: "Pacote Completo com 100 Avaliações de Ciências",
    desc: "Avaliações diagnósticas, provas por bimestre, atividades avaliativas, critérios de correção e gabaritos.",
    from: "R$ 47,00",
  },
  {
    img: bonusMiniManual,
    title: "Guia do Professor para Aulas Dinâmicas",
    desc: "Transforme suas aulas em experiências mais divertidas, organizadas e com participação ativa.",
    from: "R$ 55,00",
  },
  {
    img: bonusImprimir,
    title: "Coleção de Planos de Aula Prontos",
    desc: "Chega de perder tempo planejando do zero. Aulas organizadas e prontas para aplicar imediatamente.",
    from: "R$ 37,00",
  },
  {
    img: bonusEmocoes,
    title: "Planejamento de Aulas de Ciências",
    desc: "Planejamento estruturado para facilitar sua rotina, com clareza, sequência lógica e eficiência.",
    from: "R$ 37,00",
  },
  {
    img: bonusSemExposicao,
    title: "Experimentos Prontos para Aplicar",
    desc: "Coleção de atividades práticas para trabalhar coordenação, agilidade, cooperação e participação.",
    from: "R$ 29,00",
  },
];

function scrollToPricing() {
  document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
}

export function BonusSection() {
  return (
    <>
      {/* Bonus section */}
      <section className="bg-secondary/60 px-4 py-14">
        <div className="container mx-auto max-w-6xl text-center">
          <p className="text-sm font-bold uppercase tracking-wide text-primary">
            Bônus exclusivos
          </p>
          <h2 className="mt-2 text-3xl font-bold text-foreground md:text-4xl">
            E ainda leva 6 BÔNUS de presente
          </h2>
          <p className="mt-3 text-muted-foreground">
            Mais de <span className="font-bold text-foreground">R$ 254,00</span> em materiais extras
            no Plano Premium — seus, sem custo adicional.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bonuses.map((b) => (
              <div
                key={b.title}
                className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card text-left shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="relative">
                  <img
                    src={b.img}
                    alt={b.title}
                    loading="lazy"
                    className="aspect-video w-full object-cover"
                  />
                  {b.tag && (
                    <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                      {b.tag}
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-heading text-base font-bold text-foreground">{b.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">{b.desc}</p>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-sm text-muted-foreground line-through">{b.from}</span>
                    <span className="font-heading text-lg font-extrabold text-primary">
                      R$ 0,00
                    </span>
                    <span className="ml-auto rounded-full bg-accent px-2.5 py-0.5 text-xs font-bold text-accent-foreground">
                      Grátis
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
