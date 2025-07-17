import React from 'react';

interface LogoProps {
  size?: number; // largura do ícone em px
  showText?: boolean;
  className?: string;
  textSizeClass?: string;
}

// Proporção do SVG original: 3:1
const Logo: React.FC<LogoProps> = ({ size = 140, showText = true, className = '', textSizeClass = 'text-3xl md:text-4xl' }) => {
  const height = size / 3;
  return (
    <div className={`flex items-center gap-4 ${className}`} style={{ minHeight: height }}>
      <svg
        width={size}
        height={height}
        viewBox="0 0 160 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block' }}
      >
        {/* Barras do gráfico - bem grandes */}
        <rect x="0" y="25" width="28" height="25" rx="5" fill="#0B4F4F" />
        <rect x="38" y="8" width="28" height="42" rx="5" fill="#0B4F4F" />
        <rect x="76" y="0" width="28" height="50" rx="5" fill="#0B4F4F" />
        {/* Seta curva - mais proeminente */}
        <path d="M0 40 C35 -15, 110 -15, 135 20" stroke="#38C995" strokeWidth="6" fill="none" />
        {/* Ponta da seta - maior */}
        <polygon points="135,20 128,8 148,14" fill="#38C995" />
      </svg>
      {showText && (
        <span
          className={`font-bold leading-tight select-none ${textSizeClass}`}
          style={{
            fontFamily: 'Poppins, Arial, sans-serif',
            letterSpacing: '-0.02em',
            fontWeight: 700,
            color: '#0B4F4F',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          Fluxo
          <span
            style={{
              fontWeight: 400,
              marginLeft: 8,
              color: '#0B4F4F',
            }}
            className="font-normal"
          >
            Fácil
          </span>
        </span>
      )}
    </div>
  );
};

export default Logo; 