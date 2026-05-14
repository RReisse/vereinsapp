interface JerseyIconProps {
  number: number;
  size?: number;
}

export default function JerseyIcon({ number, size = 40 }: JerseyIconProps) {
  return (
    <div
      className="relative flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 40 40" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Sleeves */}
        <path
          d="M4 10 L10 7 L10 17 L4 15 Z"
          fill="#f5c518"
        />
        <path
          d="M36 10 L30 7 L30 17 L36 15 Z"
          fill="#f5c518"
        />
        {/* Body */}
        <path
          d="M10 7 L15 5 Q20 8 25 5 L30 7 L30 35 L10 35 Z"
          fill="#f5c518"
        />
        {/* Collar */}
        <path
          d="M15 5 Q20 8.5 25 5"
          fill="none"
          stroke="#d4a800"
          strokeWidth="0.8"
        />
        {/* Outline */}
        <path
          d="M4 10 L10 7 L15 5 Q20 8 25 5 L30 7 L36 10 L36 15 L30 17 L30 35 L10 35 L10 17 L4 15 Z"
          fill="none"
          stroke="#d4a800"
          strokeWidth="0.8"
          strokeLinejoin="round"
        />
      </svg>
      <span
        className="absolute font-bold text-[#1a1a1a]"
        style={{ fontSize: size * 0.35, top: '42%', transform: 'translateY(-50%)' }}
      >
        {number}
      </span>
    </div>
  );
}
