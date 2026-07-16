import { useRef, useState } from "react";
import { Zap, Lock, ShieldCheck, ArrowRight, Play, Pause } from "lucide-react";

const HERO_VIDEO_URL = "/videos/meu-video-final.mp4";

const trust = [
  { icon: Zap, label: "Acesso imediato" },
  { icon: Lock, label: "Pagamento seguro" },
  { icon: ShieldCheck, label: "7 dias de garantia — ou seu dinheiro de volta" },
];

const stats = [
  { value: "500+", label: "Recursos" },
  { value: "12k+", label: "Professores" },
  { value: "4,9★", label: "Avaliação" },
];

function scrollToPricing() {
  document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
}

export function HeroSection() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  function toggleVideoPlayback() {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.volume = 1;
      void video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }

  return (
    <section className="bg-background px-4 pb-12 pt-10 sm:pt-14">
      <div className="container mx-auto max-w-4xl text-center">
        <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight text-foreground sm:text-5xl md:text-6xl">
          <span
            style={{
              background: "linear-gradient(135deg, #006904, #1f8b2f)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Pare de perder
          </span>{" "}
          seu{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #006904, #1f8b2f)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            fim de semana
          </span>{" "}
          planejando aula de Ciências
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base font-bold text-muted-foreground sm:text-lg">
          Mais de 500 dinâmicas prontas para o Fundamental ao Médio — é só abrir, imprimir
          (ou projetar) e aplicar. Sem passar horas montando do zero.
        </p>

        <div className="relative mx-auto mt-10 w-full max-w-[300px] rounded-[2rem] border-8 border-foreground/90 bg-foreground/90 shadow-2xl">
          <video
            ref={videoRef}
            src={HERO_VIDEO_URL}
            poster="/videos/meu-video-poster.jpg"
            playsInline
            preload="none"
            controls={false}
            className="aspect-[9/16] w-full rounded-[1.6rem] bg-black object-cover"
            onEnded={() => setIsPlaying(false)}
            onPause={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
          />

          <button
            type="button"
            onClick={toggleVideoPlayback}
            aria-label={isPlaying ? "Pausar vídeo" : "Reproduzir vídeo"}
            className="absolute inset-0 m-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-[#006904] shadow-lg transition hover:scale-105"
          >
            {isPlaying ? <Pause className="h-7 w-7" /> : <Play className="ml-1 h-7 w-7" />}
          </button>
        </div>

        <button
          onClick={scrollToPricing}
          className="mt-8 inline-flex w-full max-w-md items-center justify-center gap-2 rounded-2xl px-8 py-5 font-heading text-lg font-bold uppercase tracking-wide text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
          style={{
            background: "linear-gradient(135deg, #006904 0%, #1f8b2f 100%)",
          }}
        >
          Quero recuperar meu tempo
          <ArrowRight className="h-5 w-5" />
        </button>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground sm:text-sm">
          {trust.map((t) => (
            <span key={t.label} className="inline-flex items-center gap-1.5">
              <t.icon className="h-4 w-4 text-primary" />
              {t.label}
            </span>
          ))}
        </div>

        <p className="mt-10 font-heading text-lg font-bold text-foreground">
          Zero tempo de preparo
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          500+ dinâmicas testadas em sala, prontas pra usar
        </p>

        <div className="mx-auto mt-8 grid max-w-2xl grid-cols-3 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
              <p className="font-heading text-2xl font-extrabold text-primary">{s.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
