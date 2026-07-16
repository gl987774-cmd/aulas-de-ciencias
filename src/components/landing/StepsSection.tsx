import { ArrowRight } from "lucide-react";

function scrollToPricing() {
  document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
}

export function StepsSection() {
  return (
    <section className="bg-primary px-4 py-16 text-primary-foreground">
      <div className="container mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold md:text-4xl">
          Pronto para ter seu fim de semana de volta?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl opacity-90">
          Junte-se a mais de 12 mil professores que já deixaram suas aulas mais organizadas,
          participativas e divertidas — sem gastar o domingo planejando.
        </p>
        <button
          onClick={scrollToPricing}
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-2xl px-8 py-4 font-heading font-bold uppercase tracking-wide text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
          style={{ background: "linear-gradient(135deg, #006904 0%, #1f8b2f 100%)" }}
        >
          Quero recuperar meu tempo
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}
