import author from "@/assets/landing/author-sophia.webp";

const stats = [
  { value: "15+", label: "Anos em sala" },
  { value: "500+", label: "Recursos" },
  { value: "12k+", label: "Professores" },
];

export function AuthorSection() {
  return (
    <section className="bg-background px-4 py-14">
      <div className="container mx-auto max-w-4xl">
        <p className="text-center text-sm font-bold uppercase tracking-wide text-primary">
          Quem está por trás
        </p>
        <h2 className="mt-2 text-center text-3xl font-bold text-foreground md:text-4xl">
          Olá! Eu sou a Profª Sophia
        </h2>

        <div className="mt-10 flex flex-col items-center gap-8 rounded-2xl border border-border bg-card p-8 shadow-sm md:flex-row">
          <img
            src={author}
            alt="Profª Sophia"
            loading="lazy"
            className="h-44 w-44 shrink-0 rounded-full border-4 border-secondary object-cover shadow-md"
          />
          <div className="text-center md:text-left">
            <p className="text-muted-foreground">
              Há 15 anos em sala de aula como professora de Ciências, desenvolvi o{" "}
              <span className="font-bold text-foreground">BioAtividades</span> para resolver a
              dificuldade que muitos professores enfrentam: criar aulas diferentes, organizadas e
              realmente envolventes.
            </p>
            <p className="mt-4 text-muted-foreground">
              Cada uma das 500+ dinâmicas foi testada em turmas reais antes de chegar até você.
            </p>

            <div className="mt-6 grid grid-cols-3 gap-4">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="font-heading text-xl font-extrabold text-primary">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
