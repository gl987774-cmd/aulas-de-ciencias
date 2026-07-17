import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, Download, ShieldCheck, Mail } from "lucide-react";
import { getAccessData } from "@/lib/pix.server";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/acesso")({
  component: AcessoPage,
});

function AcessoPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<{
    name: string;
    email: string;
    planName: string;
    amount: number;
    paidAt?: string;
    whatsappDelivery: boolean;
    phone: string;
  } | null | "loading">("loading");

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (!token) {
      navigate({ to: "/" });
      return;
    }
    getAccessData({ data: { token } }).then((result) => {
      setData(result);
    });
  }, [navigate]);

  if (data === "loading") {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="text-muted-foreground">Verificando acesso...</p>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-xl font-heading font-bold text-foreground">
            Acesso não encontrado
          </h1>
          <p className="text-muted-foreground text-sm">
            Este link de acesso é inválido ou expirou. Se você acabou de
            comprar, verifique seu e-mail.
          </p>
          <Button onClick={() => navigate({ to: "/" })} variant="outline">
            Voltar para página inicial
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center space-y-3">
          <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-green-800">
            Acesso Liberado! 🎉
          </h1>
          <p className="text-muted-foreground">
            Olá, <strong>{data.name}</strong>! Seu acesso ao{" "}
            <strong>{data.planName}</strong> já está disponível.
          </p>
        </div>

        <a
          href="https://drive.google.com/drive/folders/1mVHPgHYJXmJIv1syp3fi-dL87A43AyOt?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 w-full h-14 rounded-2xl font-heading font-bold text-lg text-white shadow-xl hover:shadow-2xl transition-all hover:-translate-y-0.5"
          style={{
            background: "linear-gradient(135deg, #006904 0%, #1f8b2f 100%)",
          }}
        >
          <Download className="w-6 h-6" />
          Acessar meu material
        </a>

        <div className="bg-white border border-green-200 rounded-2xl p-6 space-y-4 shadow-sm">
          <h2 className="font-heading font-bold text-foreground">
            Detalhes da compra
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Plano</span>
              <span className="font-medium">{data.planName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email</span>
              <span>{data.email}</span>
            </div>
            {data.phone && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">WhatsApp</span>
                <span>{data.phone}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Valor</span>
              <span className="font-bold text-primary">
                {data.amount.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </div>
            {data.paidAt && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pago em</span>
                <span>
                  {new Date(data.paidAt).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border border-green-200 rounded-2xl p-6 space-y-3 shadow-sm">
          <div className="flex items-center gap-2 text-green-700 text-sm">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>Pagamento aprovado</span>
          </div>
          <div className="flex items-center gap-2 text-green-700 text-sm">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>E-mail enviado com seu acesso</span>
          </div>
          <div className="flex items-center gap-2 text-green-700 text-sm">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>Material pronto para download</span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <Mail className="w-3 h-3" />
            Enviamos uma cópia do acesso para{" "}
            <strong>{data.email}</strong>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          🛡️ Garantia incondicional de 7 dias — se não gostar, devolvemos
          seu dinheiro
        </p>
      </div>
    </main>
  );
}
