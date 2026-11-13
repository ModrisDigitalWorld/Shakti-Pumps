/** Original line illustration: motor + end-suction pump on a baseplate. Used as the hero fallback. */
export function PumpIllustration({ className }: { className?: string }) {
  const stroke = "rgba(255,255,255,0.9)";
  const fill = "rgba(255,255,255,0.07)";
  return (
    <svg viewBox="0 0 520 360" className={className} role="img" aria-label="Illustration of a pump and motor set" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <g stroke={stroke} strokeWidth="2" fill={fill}>
        {/* baseplate */}
        <rect x="36" y="296" width="448" height="16" rx="2" />
        <rect x="56" y="312" width="28" height="12" />
        <rect x="436" y="312" width="28" height="12" />
        {/* motor */}
        <rect x="60" y="172" width="172" height="112" rx="12" />
        <rect x="44" y="192" width="16" height="72" rx="3" />
        <rect x="116" y="146" width="56" height="26" rx="3" />
        <rect x="70" y="284" width="40" height="12" />
        <rect x="180" y="284" width="40" height="12" />
        {/* coupling + shaft */}
        <rect x="232" y="216" width="40" height="24" rx="2" />
        {/* pump casing */}
        <circle cx="352" cy="228" r="68" />
        <circle cx="352" cy="228" r="42" />
        <circle cx="352" cy="228" r="11" />
        <rect x="318" y="288" width="68" height="8" />
        {/* discharge */}
        <rect x="334" y="104" width="36" height="58" />
        <rect x="322" y="94" width="60" height="12" rx="2" />
        {/* suction */}
        <rect x="418" y="204" width="56" height="48" />
        <rect x="470" y="194" width="14" height="68" rx="2" />
      </g>
      <g stroke={stroke} strokeWidth="1.5" opacity="0.55">
        {[84, 98, 112, 126, 140, 154, 168, 182, 196, 210].map((x) => (
          <line key={x} x1={x} y1="182" x2={x} y2="274" />
        ))}
        <path d="M352 186v-24M330 228h-16M374 228h20" strokeDasharray="3 5" />
      </g>
    </svg>
  );
}

/** Neutral product placeholder for items that have no photo yet. */
export function PlaceholderArt() {
  return (
    <svg viewBox="0 0 120 90" className="absolute inset-0 h-full w-full text-brand-200" fill="none" stroke="currentColor" strokeWidth="1.5" role="img" aria-label="No image available">
      <circle cx="60" cy="48" r="20" />
      <circle cx="60" cy="48" r="10" />
      <rect x="54" y="14" width="12" height="14" />
      <rect x="80" y="42" width="18" height="12" />
      <rect x="28" y="72" width="64" height="4" />
    </svg>
  );
}
