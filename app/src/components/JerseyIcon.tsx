interface JerseyIconProps {
  number: number;
  size?: number;
}

export default function JerseyIcon({ number, size = 36 }: JerseyIconProps) {
  return (
    <div
      className="relative flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 36 36" width={size} height={size} fill="none">
        {/* Sleeves */}
        <path d="M3 9 L9 6.5 L9 15 L3 13 Z" fill="#f5c518" />
        <path d="M33 9 L27 6.5 L27 15 L33 13 Z" fill="#f5c518" />
        {/* Body */}
        <path d="M9 6.5 L13.5 4.5 Q18 7.5 22.5 4.5 L27 6.5 L27 32 L9 32 Z" fill="#f5c518" />
        {/* Outline */}
        <path
          d="M3 9 L9 6.5 L13.5 4.5 Q18 7.5 22.5 4.5 L27 6.5 L33 9 L33 13 L27 15 L27 32 L9 32 L9 15 L3 13 Z"
          fill="none"
          stroke="#d4a800"
          strokeWidth="0.7"
          strokeLinejoin="round"
        />
        {/* Collar */}
        <path d="M13.5 4.5 Q18 7.8 22.5 4.5" fill="none" stroke="#d4a800" strokeWidth="0.6" />
      </svg>
      <span
        className="absolute font-bold text-[#333]"
        style={{ fontSize: size * 0.36, top: '44%', transform: 'translateY(-50%)' }}
      >
        {number}
      </span>
    </div>
  );
}
