const pains = [
  {
    icon: "⏰",
    title: "O fim de semana vira trabalho",
    desc: "Você monta atividades do zero toda semana, rouba tempo da família e ainda não dá conta de tudo.",
  },
  {
    icon: "😴",
    title: "Alunos desmotivados",
    desc: "A turma não engaja com a aula expositiva tradicional e o celular vence a atenção a cada minuto.",
  },
  {
    icon: "📋",
    title: "Cobrança da BNCC",
    desc: "Cada nova competência exige adaptar materiais e provar alinhamento — uma carga extra silenciosa.",
  },
];

function scrollToPricing() {
  document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
}

export function PainSection() {
  return (
    <section className="bg-secondary/60 px-4 py-14">
      <div className="container mx-auto max-w-4xl text-center">
        <p className="text-sm font-bold uppercase tracking-wide text-primary">
          Você já passou por isso?
        </p>
        <h2 className="mt-2 text-3xl font-bold text-foreground md:text-4xl">
          Seu domingo à noite também vira sessão de planejamento?
        </h2>

        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {pains.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl border border-border bg-card p-6 text-left shadow-sm"
            >
              <div className="text-3xl">{p.icon}</div>
              <h3 className="mt-3 font-heading text-base font-bold text-foreground">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
            </div>
          ))}
        </div>

        <button
          onClick={scrollToPricing}
          className="mt-10 inline-flex items-center justify-center rounded-2xl px-8 py-4 font-heading font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
          style={{ background: "linear-gradient(135deg, #006904 0%, #1f8b2f 100%)" }}
        >
          Quero recuperar meu tempo
        </button>
      </div>
    </section>
  );
}
