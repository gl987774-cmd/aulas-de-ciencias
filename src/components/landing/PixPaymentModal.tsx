import { Component, useState, useEffect, useCallback, useRef, type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Copy,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Lock,
  RefreshCw,
  ArrowLeft,
  Clock,
  Zap,
  Check,
  Wallet,
  Mail,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  createPixPayment,
  checkPixStatus,
  confirmPurchase,
  type PixPaymentData,
} from "@/lib/pix.server";

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null };
  static getDerivedStateFromError(error: Error) {
    console.error("[ErrorBoundary]", error);
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div className="p-8 text-center space-y-4">
          <p className="text-lg font-bold text-red-600">Algo deu errado</p>
          <p className="text-sm text-muted-foreground">{this.state.error.message}</p>
          <Button onClick={() => this.setState({ error: null })} variant="outline">
            Tentar novamente
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}

type PlanInfo = {
  name: string;
  amount: number;
  externalUrl?: string;
};

type ModalStep = "checkout" | "loading" | "qr" | "paid" | "error";

interface PixPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: PlanInfo;
}

function useCountdown(initial: number, running: boolean) {
  const [remaining, setRemaining] = useState(initial);
  useEffect(() => {
    if (!running) return;
    setRemaining(initial);
    const id = setInterval(() => {
      setRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [initial, running]);
  return remaining;
}

function fmtCountdown(s: number) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
}

export function PixPaymentModal({
  open,
  onOpenChange,
  plan,
}: PixPaymentModalProps) {
  const [step, setStep] = useState<ModalStep>("checkout");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [pixData, setPixData] = useState<PixPaymentData | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [elapsed, setElapsed] = useState(0);

  const [paymentId, setPaymentId] = useState<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const countdown = useCountdown(600, step === "checkout");

  useEffect(() => {
    if (open) {
      setStep("checkout");
      setEmail("");
      setName("");
      setPixData(null);
      setCopied(false);
      setErrorMsg("");
      setElapsed(0);

      setPaymentId(null);
    }
  }, [open]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const stopTimers = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const handlePaid = useCallback(async (paymentIdNum: number) => {
    try {
      await confirmPurchase({
        data: {
          paymentId: paymentIdNum,
          email,
          name: name || email,
          planName: plan.name,
          amount: plan.amount,
          whatsappDelivery: false,
          phone: "",
        },
      });
    } catch (err) {
      console.error("Erro ao confirmar compra:", err);
    }
  }, [email, name, plan.name, plan.amount]);

  const handleGeneratePix = useCallback(async () => {
    if (!email.includes("@")) return;
    console.log("[PixPaymentModal] handleGeneratePix", { email, plan: plan.name, amount: plan.amount });
    setStep("loading");
    setErrorMsg("");

    try {
      const result = await createPixPayment({
        data: {
          planName: plan.name,
          amount: plan.amount,
          email,
        },
      });
      setPixData(result);
      setPaymentId(result.id);
      setStep("qr");
      setElapsed(0);

      intervalRef.current = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);

      pollRef.current = setInterval(async () => {
        try {
          const statusData = await checkPixStatus({
            data: { paymentId: result.id },
          });
          if (statusData.status === "approved") {
            setStep("paid");
            stopTimers();
            handlePaid(result.id);
          }
        } catch {
          // silently retry
        }
      }, 2000);
    } catch (err) {
      stopTimers();
      setErrorMsg(
        err instanceof Error ? err.message : "Erro ao gerar pagamento PIX"
      );
      console.error("[PixPaymentModal] createPixPayment error:", err);
      setStep("error");
    }
  }, [email, plan.name, plan.amount, stopTimers, handlePaid]);

  const checkNow = useCallback(async () => {
    if (!pixData) return;
    try {
      const statusData = await checkPixStatus({
        data: { paymentId: pixData.id },
      });
      if (statusData.status === "approved") {
        setStep("paid");
        stopTimers();
        handlePaid(pixData.id);
      }
    } catch {
      // silent
    }
  }, [pixData, stopTimers, handlePaid]);

  const handleCopy = useCallback(async () => {
    if (!pixData) return;
    try {
      await navigator.clipboard.writeText(pixData.qrCodeText);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = pixData.qrCodeText;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [pixData]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const priceFormatted = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <ErrorBoundary>
      <DialogContent
        className="sm:max-w-[500px] p-0 gap-0 overflow-hidden rounded-2xl max-h-[95vh] overflow-y-auto"
      >
        {/* Checkout Step */}
        {step === "checkout" && (
          <div>
            <div className="bg-gradient-to-r from-red-600 to-red-500 px-4 py-3 text-center">
              <p className="text-xs font-bold uppercase tracking-wider text-red-100">
                🔥 Oferta por tempo limitado!
              </p>
              <p className="mt-1 font-mono text-2xl font-black text-white tabular-nums tracking-widest drop-shadow">
                {fmtCountdown(countdown)}
              </p>
            </div>

            <div className="p-5 space-y-5">
              {/* Product */}
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-green-600 to-green-500 flex items-center justify-center text-white text-lg font-black shadow">
                  B
                </div>
                <div>
                  <p className="font-heading font-bold text-foreground">
                    {plan.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Acesso vitalício com todas atualizações
                  </p>
                  <p className="mt-1 font-heading text-xl font-extrabold text-primary">
                    {priceFormatted(plan.amount)}
                  </p>
                </div>
              </div>



              {/* Summary */}
              <div className="rounded-xl bg-muted/60 p-4 space-y-2 text-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Resumo do Pedido
                </p>
                <div className="flex justify-between">
                  <span className="text-foreground">{plan.name}</span>
                  <span className="font-bold text-primary">
                    {priceFormatted(plan.amount)}
                  </span>
                </div>
              </div>

              {/* Form */}
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Preencha para receber o produto
                </p>
                <Input
                  type="email"
                  placeholder="Seu melhor email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 text-sm"
                />
                <Input
                  type="text"
                  placeholder="Seu nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-11 text-sm"
                />
              </div>

              {/* Payment */}
              <div className="rounded-xl border border-border p-4 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Forma de pagamento
                </p>
                <div className="flex items-center gap-3 rounded-lg bg-green-50 border border-green-200 px-4 py-3">
                  <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center shrink-0">
                    <Wallet className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-800">PIX</p>
                    <p className="text-xs text-green-600">
                      Pagamento instantâneo e seguro
                    </p>
                  </div>
                  <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                </div>
              </div>

              <Button
                onClick={handleGeneratePix}
                disabled={!email.includes("@")}
                className="w-full h-12 text-base font-heading font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                style={{
                  background:
                    "linear-gradient(135deg, #006904 0%, #1f8b2f 100%)",
                }}
              >
                <Zap className="w-5 h-5" />
                CONTINUAR
              </Button>

              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Pagamento 100% seguro
                </span>
                <span className="inline-flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> 7 dias de garantia
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Loading */}
        {step === "loading" && (
          <div className="p-14 text-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
            <p className="text-base font-medium">Gerando QR Code PIX...</p>
            <p className="text-sm text-muted-foreground">
              Aguarde um instante
            </p>
          </div>
        )}

        {/* QR Code */}
        {step === "qr" && pixData && (
          <div>
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-4 text-center">
              <DialogTitle className="text-lg font-heading font-bold text-white">
                Pagamento via PIX
              </DialogTitle>
              <p className="text-sm text-emerald-100 mt-0.5">
                Escaneie ou copie o código para pagar
              </p>
            </div>

            <div className="p-5 space-y-5">
              {/* QR Code */}
              <div className="flex justify-center">
                <div className="relative p-2.5 rounded-xl bg-white shadow-[0_4px_24px_rgba(0,0,0,0.08)] ring-1 ring-black/5">
                  <img
                    src={`data:image/png;base64,${pixData.qrCodeBase64}`}
                    alt="QR Code PIX"
                    className="w-52 h-52 md:w-56 md:h-56"
                  />
                </div>
              </div>

              {/* PIX Copia e Cola */}
              <div className="space-y-1.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center">
                  Código PIX copia e cola
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-muted/80 rounded-lg px-3.5 py-3 text-xs font-mono leading-relaxed text-muted-foreground border select-all break-all max-h-[72px] overflow-y-auto">
                    {pixData.qrCodeText}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    className="shrink-0 h-[72px] w-[56px] flex-col gap-1 rounded-lg border-2"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <span className="text-[10px] font-semibold">Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5" />
                        <span className="text-[10px] font-semibold">Copiar</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Status + Timer */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
                    </span>
                    <span className="text-sm font-semibold text-amber-800">Aguardando pagamento</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">
                    <Clock className="w-3 h-3" />
                    {formatTime(elapsed)}
                  </span>
                </div>
                <div className="w-full bg-amber-200/60 rounded-full h-1.5">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-1000 ease-linear"
                    style={{
                      width: `${Math.min((elapsed / 600) * 100, 95)}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-amber-600 text-center">
                  Estamos verificando seu pagamento automaticamente...
                </p>
              </div>

              {/* Order Summary */}
              <div className="bg-muted/40 rounded-xl divide-y divide-border">
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm text-muted-foreground">Produto</span>
                  <span className="text-sm font-semibold">{plan.name}</span>
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm text-muted-foreground">Valor</span>
                  <span className="text-base font-bold text-emerald-700">
                    {priceFormatted(plan.amount)}
                  </span>
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm text-muted-foreground">Email</span>
                  <span className="text-sm truncate max-w-[180px] font-medium">{email}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2.5">
                <Button
                  onClick={checkNow}
                  className="w-full h-12 gap-2 font-heading font-bold text-base shadow-lg hover:shadow-xl transition-all"
                  style={{
                    background: "linear-gradient(135deg, #006904 0%, #1f8b2f 100%)",
                  }}
                >
                  <RefreshCw className="w-5 h-5" />
                  Já paguei! Verificar
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    stopTimers();
                    setStep("checkout");
                  }}
                  className="w-full h-10 text-sm text-muted-foreground"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Voltar e escolher outra forma
                </Button>
              </div>

              {/* Security */}
              <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" /> Pagamento seguro
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Garantia de 7 dias
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Paid - Success! */}
        {step === "paid" && (
          <div className="p-8 text-center space-y-6">
            <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>

            <div className="space-y-2">
              <DialogTitle className="text-2xl font-heading font-bold text-green-700">
                Parabéns pela sua compra! 🎉
              </DialogTitle>
              <p className="text-muted-foreground">
                Seu pagamento foi aprovado com sucesso.
              </p>
            </div>

            {/* Access Link Card */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-5 space-y-3">
              <p className="font-heading font-bold text-green-800 text-sm">
                ✅ Seu acesso já está liberado
              </p>
              <a
                href="https://drive.google.com/drive/folders/1mVHPgHYJXmJIv1syp3fi-dL87A43AyOt?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full h-12 rounded-xl font-heading font-bold text-base text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                style={{
                  background:
                    "linear-gradient(135deg, #006904 0%, #1f8b2f 100%)",
                }}
              >
                <Download className="w-5 h-5" />
                Acessar meu produto
              </a>
              <div className="flex items-center justify-center gap-1.5 text-xs text-green-700">
                <Mail className="w-3 h-3" />
                Enviamos um e-mail com seu acesso para{" "}
                <strong>{email}</strong>
              </div>
            </div>

            {/* Checkmarks */}
            <div className="space-y-2 text-left bg-muted/40 rounded-xl p-4 text-sm">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Pagamento aprovado</span>
              </div>
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>E-mail enviado com seu acesso</span>
              </div>
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Acesso já liberado</span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              🛡️ Garantia incondicional de 7 dias — se não gostar, devolvemos
              seu dinheiro
            </p>
          </div>
        )}

        {/* Error */}
        {step === "error" && (
          <div className="p-8 text-center space-y-5">
            <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <RefreshCw className="w-8 h-8 text-red-500" />
            </div>
            <div className="space-y-2">
              <DialogTitle className="text-xl font-heading font-bold text-destructive">
                Algo deu errado
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                {errorMsg ||
                  "Não foi possível gerar o PIX. Tente novamente."}
              </p>
            </div>
            <div className="space-y-3">
              <Button
                onClick={() => setStep("checkout")}
                className="w-full h-12 text-base font-heading font-bold"
                style={{
                  background:
                    "linear-gradient(135deg, #006904 0%, #1f8b2f 100%)",
                }}
              >
                Tentar Novamente
              </Button>
              {plan.externalUrl && (
                <a
                  href={plan.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full h-11 rounded-xl border border-input text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Lock className="w-4 h-4" />
                  Comprar via checkout externo
                </a>
              )}
              <Button
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="w-full h-10 text-sm text-muted-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Voltar para a página
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
      </ErrorBoundary>
    </Dialog>
  );
}
