export function TopBanner() {
  const hoje = new Date().toLocaleDateString("pt-BR");
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 px-4 py-2.5 text-center" style={{ backgroundColor: "#F72B2A" }}>
      <span className="text-xs font-bold text-white sm:text-sm">
        Oferta especial — apenas hoje {hoje}
      </span>
      <span className="rounded-full bg-background px-3 py-0.5 text-xs font-bold sm:text-sm">
        <span className="text-green-600">✓</span>{" "}
        <span className="text-black">100% Alinhado à BNCC</span>
      </span>
    </div>
  );
}
