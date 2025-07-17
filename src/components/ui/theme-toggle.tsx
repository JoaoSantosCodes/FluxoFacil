import React, { useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

// CSS animation for pulse effect
const pulseAnimation = `
  @keyframes themeTogglePulse {
    0%, 100% {
      opacity: 0.6;
      transform: translate(-50%, -50%) scale(1);
    }
    50% {
      opacity: 0.3;
      transform: translate(-50%, -50%) scale(1.1);
    }
  }
`;

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    // Add CSS animation if not already present
    if (!document.getElementById('theme-toggle-styles')) {
      const style = document.createElement('style');
      style.id = 'theme-toggle-styles';
      style.textContent = pulseAnimation;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <button
      onClick={toggleTheme}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '44px',
        height: '44px',
        borderRadius: '12px',
        background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)',
        border: '1px solid hsl(var(--border))',
        color: 'hsl(var(--primary-foreground))',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.2)';
      }}
      aria-label={`Alternar para modo ${theme === 'light' ? 'escuro' : 'claro'}`}
    >
      {/* Background gradient overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, hsla(var(--primary-foreground) / 0.1) 0%, hsla(var(--accent-foreground) / 0.1) 100%)',
          borderRadius: '12px',
          opacity: 0,
          transition: 'opacity 0.2s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
        onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
      />
      
      {/* Icon with animation */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.3s ease'
        }}
      >
        {theme === 'light' ? (
          <Moon 
            size={20} 
            style={{
              color: 'hsl(var(--primary-foreground))',
              filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'
            }}
          />
        ) : (
          <Sun 
            size={20} 
            style={{
              color: 'hsl(var(--primary-foreground))',
              filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'
            }}
          />
        )}
      </div>

      {/* Pulse animation for dark mode */}
      {theme === 'dark' && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            height: '100%',
            borderRadius: '12px',
            background: 'radial-gradient(circle, hsla(var(--primary) / 0.3) 0%, transparent 70%)',
            animation: 'themeTogglePulse 2s infinite',
            pointerEvents: 'none'
          }}
        />
      )}
    </button>
  );
};

export const ThemeToggleCompact: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    // Add CSS animation if not already present
    if (!document.getElementById('theme-toggle-styles')) {
      const style = document.createElement('style');
      style.id = 'theme-toggle-styles';
      style.textContent = pulseAnimation;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <button
      onClick={toggleTheme}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '36px',
        height: '36px',
        borderRadius: '10px',
        background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)',
        border: '1px solid hsl(var(--border))',
        color: 'hsl(var(--primary-foreground))',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-1px) scale(1.05)';
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.25)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
      }}
      aria-label={`Alternar para modo ${theme === 'light' ? 'escuro' : 'claro'}`}
    >
      {/* Background gradient overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, hsla(var(--primary-foreground) / 0.1) 0%, hsla(var(--accent-foreground) / 0.1) 100%)',
          borderRadius: '10px',
          opacity: 0,
          transition: 'opacity 0.2s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
        onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
      />
      
      {/* Icon with animation */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.3s ease'
        }}
      >
        {theme === 'light' ? (
          <Moon 
            size={16} 
            style={{
              color: 'hsl(var(--primary-foreground))',
              filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
            }}
          />
        ) : (
          <Sun 
            size={16} 
            style={{
              color: 'hsl(var(--primary-foreground))',
              filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
            }}
          />
        )}
      </div>

      {/* Pulse animation for dark mode */}
      {theme === 'dark' && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            height: '100%',
            borderRadius: '10px',
            background: 'radial-gradient(circle, hsla(var(--primary) / 0.3) 0%, transparent 70%)',
            animation: 'themeTogglePulse 2s infinite',
            pointerEvents: 'none'
          }}
        />
      )}
    </button>
  );
};

export const ThemeToggleLarge: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    // Add CSS animation if not already present
    if (!document.getElementById('theme-toggle-styles')) {
      const style = document.createElement('style');
      style.id = 'theme-toggle-styles';
      style.textContent = pulseAnimation;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <button
      onClick={toggleTheme}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        borderRadius: '12px',
        background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)',
        border: '1px solid hsl(var(--border))',
        color: 'hsl(var(--primary-foreground))',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        minWidth: '140px',
        justifyContent: 'center',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.2)';
      }}
      aria-label={`Alternar para modo ${theme === 'light' ? 'escuro' : 'claro'}`}
    >
      {/* Background gradient overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, hsla(var(--primary-foreground) / 0.1) 0%, hsla(var(--accent-foreground) / 0.1) 100%)',
          borderRadius: '12px',
          opacity: 0,
          transition: 'opacity 0.2s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
        onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
      />
      
      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          transition: 'transform 0.3s ease'
        }}
      >
        {theme === 'light' ? (
          <>
            <Moon 
              size={20} 
              style={{
                color: 'hsl(var(--primary-foreground))',
                filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'
              }}
            />
            <span style={{
              fontSize: '14px',
              fontWeight: '600',
              color: 'hsl(var(--primary-foreground))',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
            }}>
              Modo Escuro
            </span>
          </>
        ) : (
          <>
            <Sun 
              size={20} 
              style={{
                color: 'hsl(var(--primary-foreground))',
                filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'
              }}
            />
            <span style={{
              fontSize: '14px',
              fontWeight: '600',
              color: 'hsl(var(--primary-foreground))',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
            }}>
              Modo Claro
            </span>
          </>
        )}
      </div>

      {/* Pulse animation for dark mode */}
      {theme === 'dark' && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            height: '100%',
            borderRadius: '12px',
            background: 'radial-gradient(circle, hsla(var(--primary) / 0.2) 0%, transparent 70%)',
            animation: 'themeTogglePulse 2s infinite',
            pointerEvents: 'none'
          }}
        />
      )}
    </button>
  );
}; 