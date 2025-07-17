import React from 'react';

interface LogoProps {
  size?: number; // largura em px
  showText?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 120, showText = true, className = '' }) => {
  const height = size / 3; // proporção 3:1
  return (
    <div className={`flex items-center gap-2 ${className}`} style={{ minHeight: height }}>
      <svg
        width={size}
        height={height}
        viewBox="0 0 180 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          display: 'block',
        }}
      >
        {/* Fundo branco para contraste */}
        {/* <rect width="180" height="60" fill="white"/> */}
        {/* Barras do gráfico */}
        <rect x="0" y="36" width="12" height="24" rx="3" fill="#0B4F4F" />
        <rect x="18" y="24" width="12" height="36" rx="3" fill="#0B4F4F" />
        <rect x="36" y="12" width="12" height="48" rx="3" fill="#0B4F4F" />
        {/* Seta curva */}
        <path d="M0 48 C15 10, 40 10, 60 24" stroke="#38C995" strokeWidth="4" fill="none" />
        {/* Ponta da seta */}
        <polygon points="60,24 56,16 70,19" fill="#38C995" />
      </svg>
      {showText && (
        <span
          className="font-bold text-xl md:text-2xl leading-tight text-teal-800 dark:text-teal-200 select-none"
          style={{
            fontFamily: 'Poppins, Arial, sans-serif',
            letterSpacing: '-0.02em',
            fontWeight: 600,
            textShadow: '0 1px 2px rgba(0,0,0,0.08)',
            marginLeft: 4,
            lineHeight: 1.1,
          }}
        >
          Fluxo<span style={{ fontWeight: 400, marginLeft: 6 }}>Fácil</span>
        </span>
      )}
    </div>
  );
};

export default Logo; 