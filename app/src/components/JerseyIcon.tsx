interface JerseyIconProps {
  number: number;
  size?: number;
}

export default function JerseyIcon({ number, size = 40 }: JerseyIconProps) {
  const fontSize = number > 9 ? size * 0.32 : size * 0.36;

  return (
    <div
      className="relative flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      {/* Ambient backlight glow */}
      <div
        className="absolute rounded-full bg-amber/10 blur-md"
        style={{ inset: -size * 0.1 }}
      />
      <svg viewBox="0 0 40 40" width={size} height={size} fill="none" className="relative">
        <defs>
          <linearGradient id={`jersey-${number}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffe066" />
            <stop offset="100%" stopColor="#f5c518" />
          </linearGradient>
        </defs>
        {/* Sleeves */}
        <path d="M3.5 10.5 L10 7 L10 16 L3.5 14 Z" fill={`url(#jersey-${number})`} />
        <path d="M36.5 10.5 L30 7 L30 16 L36.5 14 Z" fill={`url(#jersey-${number})`} />
        {/* Body */}
        <path d="M10 7 L15 4.5 Q20 8 25 4.5 L30 7 L30 34 L10 34 Z" fill={`url(#jersey-${number})`} />
        {/* Outline */}
        <path
          d="M3.5 10.5 L10 7 L15 4.5 Q20 8 25 4.5 L30 7 L36.5 10.5 L36.5 14 L30 16 L30 34 L10 34 L10 16 L3.5 14 Z"
          fill="none"
          stroke="#c89e00"
          strokeWidth="0.6"
          strokeLinejoin="round"
        />
        {/* Collar */}
        <path d="M15 4.5 Q20 8.2 25 4.5" fill="none" stroke="#c89e00" strokeWidth="0.5" />
      </svg>
      <span
        className="absolute font-bold tabular-nums"
        style={{
          fontSize,
          top: '46%',
          transform: 'translateY(-50%)',
          color: '#1a1500',
          textShadow: '0 0.5px 0 #ffd43b44',
        }}
      >
        {number}
      </span>
    </div>
  );
}
