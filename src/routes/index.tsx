import { createFileRoute } from "@tanstack/react-router";
import { TopBanner } from "@/components/landing/TopBanner";
import { HeroSection } from "@/components/landing/HeroSection";
import { PainSection } from "@/components/landing/PainSection";
import { BenefitsSection } from "@/components/landing/BenefitsSection";
import { BonusSection } from "@/components/landing/BonusSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { GuaranteeSection } from "@/components/landing/GuaranteeSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { AuthorSection } from "@/components/landing/AuthorSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { DemoSection } from "@/components/landing/DemoSection";
import { StepsSection } from "@/components/landing/StepsSection";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen bg-background">
      <TopBanner />
      <HeroSection />
      <PainSection />
      <BenefitsSection />
      <DemoSection />
      <BonusSection />
      <PricingSection />
      <GuaranteeSection />
      <TestimonialsSection />
      <AuthorSection />
      <FAQSection />
      <StepsSection />
      <footer className="bg-foreground px-4 py-8 text-center text-sm text-background">
        <p className="font-heading font-bold">BioAtividades</p>
        <p className="mt-2 opacity-80">
          © {new Date().getFullYear()} BioAtividades — Todos os direitos reservados.
        </p>
        <p className="mt-1 opacity-70">Em caso de dúvidas: contato@atividades.com</p>
      </footer>
    </main>
  );
}
