// Inline SVG motifs that echo the logo's botanical/heart aesthetic

export function InstagramIcon({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export function HeartFlourish({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 20"
      fill="none"
      className={className}
      style={{ width: '1em', height: '0.85em' }}
      aria-hidden="true"
    >
      <path
        d="M12 19s-7-4.5-9-8.5C1 6 4 2 7.5 4.5c1.5 1.1 2.8 2.5 4.5 4.5 1.7-2 3-3.4 4.5-4.5C20 2 23 6 21 10.5 19 14.5 12 19 12 19z"
        fill="currentColor"
        opacity="0.7"
      />
    </svg>
  );
}

export function BotanicalSprig({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 24"
      fill="none"
      className={className}
      style={{ width: '120px', height: '24px' }}
      aria-hidden="true"
    >
      {/* Left sprig */}
      <path
        d="M10 12c8-8 20-6 20-6s-6 12-14 12-6-6-6-6z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.5"
      />
      <path
        d="M28 8c4-6 12-4 12-4s-4 8-10 8-2-4-2-4z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.4"
      />
      {/* Center stem */}
      <line x1="0" y1="12" x2="120" y2="12" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      {/* Small berry dots */}
      <circle cx="50" cy="8" r="1.5" fill="currentColor" opacity="0.3" />
      <circle cx="55" cy="6" r="1" fill="currentColor" opacity="0.25" />
      <circle cx="65" cy="6" r="1" fill="currentColor" opacity="0.25" />
      <circle cx="70" cy="8" r="1.5" fill="currentColor" opacity="0.3" />
      {/* Right sprig (mirrored) */}
      <path
        d="M110 12c-8-8-20-6-20-6s6 12 14 12 6-6 6-6z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.5"
      />
      <path
        d="M92 8c-4-6-12-4-12-4s4 8 10 8 2-4 2-4z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.4"
      />
    </svg>
  );
}

export function YarnSquiggle({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 12"
      fill="none"
      className={className}
      style={{ width: '200px', height: '12px' }}
      aria-hidden="true"
    >
      <path
        d="M0 6c20-8 30 8 50 0s30-8 50 0 30 8 50 0 30-8 50 0"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.4"
        style={{
          strokeDasharray: 1000,
          strokeDashoffset: 0,
        }}
      />
    </svg>
  );
}

export function RoseCircleFrame({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 rounded-full border border-rose-line opacity-40" />
      <div className="absolute inset-1 rounded-full border border-rose-line opacity-20" />
      {children}
    </div>
  );
}

export function SectionDivider() {
  return (
    <div className="section-divider text-rose-line">
      <HeartFlourish />
    </div>
  );
}
