import { useEffect, useRef, useState } from "react";
import { Play, Pause, Check } from "lucide-react";

const DEMO_VIDEO_URL =
  "https://pacotespremium.com/wp-content/uploads/2026/06/BioAtividades-500-Dinamicas-de-Ciencias-Prontas-para-Aplicar-1-1.mp4";

const demoItems = [
  "Arquivos prontos em PDF de alta qualidade",
  "Layouts coloridos e atrativos para os alunos",
  "Instruções claras de aplicação para o professor",
  "Versões para imprimir ou projetar em sala",
];

function scrollToPricing() {
  document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
}

export function DemoSection() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  function togglePlayback() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.loop = true;
    const playPromise = video.play();
    if (playPromise) {
      playPromise
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, []);

  return (
    <section className="px-4 py-14">
      <div className="container mx-auto max-w-5xl">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="mx-auto w-[240px] max-w-[75%] lg:mx-0 lg:justify-self-end">
            <div
              className="relative aspect-[9/19] rounded-[40px] bg-foreground p-3 shadow-2xl lg:w-[300px]"
              style={{
                boxShadow: "0 0 0 3px #1f2937, 0 30px 80px rgba(11,42,31,0.35)",
              }}
            >
              <div className="absolute left-1/2 top-4 z-10 h-[22px] w-[90px] -translate-x-1/2 rounded-full bg-black" />
              <div className="h-full w-full overflow-hidden rounded-[30px] bg-black">
                <video
                  ref={videoRef}
                  src={DEMO_VIDEO_URL}
                  muted
                  loop
                  playsInline
                  preload="none"
                  className="h-full w-full object-cover"
                  onEnded={() => setIsPlaying(false)}
                  onPause={() => setIsPlaying(false)}
                  onPlay={() => setIsPlaying(true)}
                />
              </div>
              <button
                type="button"
                onClick={togglePlayback}
                aria-label={isPlaying ? "Pausar" : "Reproduzir"}
                className="absolute left-1/2 top-1/2 flex h-[68px] w-[68px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-white shadow-lg transition hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, #006904 0%, #1f8b2f 100%)",
                }}
              >
                {isPlaying ? <Pause className="h-7 w-7" /> : <Play className="ml-1 h-7 w-7" />}
              </button>
            </div>
          </div>

          <div>
            <p className="inline-block rounded-full bg-primary/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-primary">
              Demonstração
            </p>
            <h2 className="mt-3 text-3xl font-bold text-foreground md:text-4xl">
              Veja na prática um pouco do material
            </h2>
            <p className="mt-4 text-muted-foreground">
              Um material visual, didático e pronto para aplicar em sala — dinâmicas que
              prendem a atenção e facilitam sua aula.
            </p>
            <ul className="mt-6 space-y-3">
              {demoItems.map((item) => (
                <li key={item} className="flex items-start gap-3 text-foreground">
                  <span
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white"
                    style={{
                      background: "linear-gradient(135deg, #006904 0%, #1f8b2f 100%)",
                    }}
                  >
                    <Check className="h-3 w-3" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <button
              onClick={scrollToPricing}
              className="mt-7 inline-flex items-center gap-2 rounded-full px-8 py-4 font-heading font-bold uppercase tracking-wide text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
              style={{
                background: "linear-gradient(135deg, #006904 0%, #1f8b2f 100%)",
              }}
            >
              Quero ter acesso →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
