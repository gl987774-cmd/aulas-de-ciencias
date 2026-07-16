const benefits = [
  {
    icon: "🎯",
    title: "Engajamento real",
    desc: "Atividades que prendem a atenção e transformam o conteúdo em experiência viva.",
  },
  {
    icon: "🧪",
    title: "Ciências prática",
    desc: "Experimentos, atividades e jogos que tornam fácil o que antes era abstrato.",
  },
  {
    icon: "👥",
    title: "Em grupo ou individual",
    desc: "Atividades pensadas para diferentes tamanhos de turma e níveis de habilidade.",
  },
  {
    icon: "📚",
    title: "100% BNCC",
    desc: "Cada atividade vem com a competência e habilidade da BNCC já mapeadas.",
  },
  {
    icon: "🖨️",
    title: "Pronto para imprimir",
    desc: "PDFs editáveis, em alta qualidade, prontos para a fotocopiadora ou para o projetor.",
  },
  {
    icon: "♾️",
    title: "Atualizações vitalícias",
    desc: "Receba todas as novas atividades que adicionarmos, sem pagar nada a mais. Para sempre.",
  },
];

export function BenefitsSection() {
  return (
    <section className="bg-background px-4 py-14">
      <div className="container mx-auto max-w-5xl">
        <p className="text-center text-sm font-bold uppercase tracking-wide text-primary">
          O que você recebe
        </p>
        <h2 className="mt-2 text-center text-3xl font-bold text-foreground md:text-4xl">
          Tudo que falta para suas aulas <span className="text-primary">decolarem</span>
        </h2>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-3 text-3xl">{b.icon}</div>
              <h3 className="font-heading text-base font-bold text-foreground">{b.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
