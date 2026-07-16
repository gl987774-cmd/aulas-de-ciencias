import { Star } from "lucide-react";
import carlos from "@/assets/landing/testimonial-carlos.jpg";
import juliana from "@/assets/landing/testimonial-juliana.png";
import andre from "@/assets/landing/testimonial-andre.jpg";

const testimonials = [
  {
    name: "Prof. Carlos M.",
    role: "Ensino Fundamental II — SP",
    quote:
      "Minhas aulas ficaram muito mais organizadas e os alunos começaram a participar muito mais das atividades. Valeu demais.",
    image: carlos,
  },
  {
    name: "Profª Juliana A.",
    role: "Ensino Médio — MG",
    quote:
      "Eu economizo várias horas por semana porque agora tenho atividades prontas para aplicar em sala.",
    image: juliana,
  },
  {
    name: "Prof. André S.",
    role: "Fundamental I — BA",
    quote:
      "As aulas ficaram muito mais divertidas e participativas. Meus alunos passaram a amar Ciências.",
    image: andre,
  },
];

export function TestimonialsSection() {
  return (
    <section className="bg-secondary/60 px-4 py-14">
      <div className="container mx-auto max-w-5xl text-center">
        <p className="text-sm font-bold uppercase tracking-wide text-primary">
          Quem já usa, recomenda
        </p>
        <h2 className="mt-2 text-3xl font-bold text-foreground md:text-4xl">
          +12 mil professores transformaram suas aulas
        </h2>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="flex flex-col rounded-2xl border border-border bg-card p-6 text-left shadow-sm"
            >
              <div className="flex gap-0.5 text-chart-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-chart-4" />
                ))}
              </div>
              <p className="mt-3 flex-1 text-sm italic text-foreground">"{t.quote}"</p>
              <div className="mt-5 flex items-center gap-3">
                <img
                  src={t.image}
                  alt={t.name}
                  loading="lazy"
                  className="h-11 w-11 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-bold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
