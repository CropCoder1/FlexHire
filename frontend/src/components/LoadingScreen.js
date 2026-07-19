import React, { useEffect, useState } from 'react';

const LoadingScreen = () => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length < 3 ? prev + '.' : ''));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, var(--color-accent_primary) 0%, var(--color-accent_secondary) 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      animation: 'fadeIn 0.3s ease-out'
    }}>
      {/* Animated Logo/Text */}
      <div style={{
        textAlign: 'center',
        animation: 'float 3s ease-in-out infinite'
      }}>
        <div style={{
          fontSize: '64px',
          fontWeight: '900',
          color: 'white',
          letterSpacing: '4px',
          marginBottom: '20px',
          textShadow: '0 8px 30px rgba(0,0,0,0.3)',
          animation: 'pulse 2s ease-in-out infinite'
        }}>
          FLEXHIRE
        </div>
        
        <div style={{
          fontSize: '18px',
          color: 'rgba(255,255,255,0.9)',
          fontWeight: '500',
          letterSpacing: '1px',
          marginBottom: '60px'
        }}>
          Connect Skills. Solve Needs. Instantly.
        </div>
      </div>

      {/* Loading Spinner */}
      <div style={{
        position: 'relative',
        width: '80px',
        height: '80px',
        marginBottom: '40px'
      }}>
        {/* Outer rotating ring */}
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          border: '4px solid rgba(255,255,255,0.3)',
          borderTop: '4px solid white',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        
        {/* Inner rotating ring (reversed) */}
        <div style={{
          position: 'absolute',
          width: '60px',
          height: '60px',
          top: '10px',
          left: '10px',
          border: '3px solid rgba(255,255,255,0.2)',
          borderRight: '3px solid white',
          borderRadius: '50%',
          animation: 'spin-reverse 1.5s linear infinite'
        }} />
      </div>

      {/* Loading Text with Dots */}
      <div style={{
        color: 'white',
        fontSize: '16px',
        fontWeight: '500',
        height: '24px',
        minWidth: '150px',
        textAlign: 'center'
      }}>
        Loading{dots}
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes spin-reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.9;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
