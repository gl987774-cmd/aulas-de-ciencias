import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Como recebo o material depois da compra?",
    a: "Assim que o pagamento é aprovado, você recebe um e-mail com o acesso imediato à área de membros, onde pode baixar todos os PDFs e materiais.",
  },
  {
    q: "Funciona para qual série / faixa etária?",
    a: "As dinâmicas cobrem do Ensino Fundamental ao Ensino Médio, com adaptações claras para cada faixa etária e nível de habilidade.",
  },
  {
    q: "Preciso de internet para usar em aula?",
    a: "Não. Você baixa os arquivos uma vez e usa em sala offline — pode imprimir ou projetar sem depender de conexão.",
  },
  {
    q: "Posso usar com várias turmas?",
    a: "Sim! O material é seu para usar com quantas turmas quiser, sem limite. É um investimento único.",
  },
  {
    q: "E se eu não gostar?",
    a: "Você tem 7 dias de garantia incondicional. Se não gostar, basta enviar um e-mail e devolvemos 100% do seu investimento, sem perguntas.",
  },
  {
    q: "As atualizações são realmente vitalícias?",
    a: "Sim. No Plano Premium, toda nova dinâmica adicionada à biblioteca fica disponível para você automaticamente, sem custo adicional.",
  },
];

export function FAQSection() {
  return (
    <section className="bg-secondary/60 px-4 py-14">
      <div className="container mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <p className="text-sm font-bold uppercase tracking-wide text-primary">
            Perguntas frequentes
          </p>
          <h2 className="mt-2 text-3xl font-bold text-foreground md:text-4xl">
            Tirando suas dúvidas
          </h2>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((f, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="rounded-xl border border-border bg-card px-6 transition-all data-[state=open]:border-primary/30 data-[state=open]:shadow-md"
            >
              <AccordionTrigger className="py-5 text-left font-heading font-semibold text-foreground hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="pb-5 leading-relaxed text-muted-foreground">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
