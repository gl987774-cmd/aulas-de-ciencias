export function GuaranteeSection() {
  return (
    <section className="bg-secondary/60 px-4 py-14">
      <div className="container mx-auto max-w-2xl rounded-2xl border-2 border-accent/40 bg-card p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-accent/10">
          <span className="font-heading text-3xl font-extrabold text-accent">7</span>
        </div>
        <p className="text-sm font-bold uppercase tracking-wide text-accent">Dias de Garantia</p>
        <h2 className="mt-2 text-2xl font-bold text-foreground md:text-3xl">
          Risco zero para você
        </h2>
        <p className="mt-4 text-muted-foreground">
          Aplique as dinâmicas em sala por 7 dias. Se não sentir sua rotina mais leve e seus alunos
          mais engajados, devolvemos 100% do seu investimento — sem perguntas, sem burocracia.
          Toda a responsabilidade é nossa.
        </p>
      </div>
    </section>
  );
}
