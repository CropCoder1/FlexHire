import React, { useState, useEffect } from 'react';

const LiveTime = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, var(--color-accent_primary) 0%, var(--color-accent_secondary) 100%)',
      borderRadius: '16px',
      padding: '24px 32px',
      color: 'white',
      boxShadow: '0 8px 24px var(--color-shadow_medium)',
      marginBottom: '30px',
      animation: 'slideInDown 0.6s ease-out',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '40px',
        flexWrap: 'wrap'
      }}>
        {/* Clock Icon & Time */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          flex: '0 1 auto'
        }}>
          <div style={{
            fontSize: '48px',
            opacity: 0.9
          }}>
            🕐
          </div>
          <div>
            <div style={{
              fontSize: '32px',
              fontWeight: '800',
              letterSpacing: '1px',
              fontFamily: 'monospace'
            }}>
              {formatTime(time)}
            </div>
            <div style={{
              fontSize: '12px',
              opacity: 0.85,
              letterSpacing: '0.5px',
              marginTop: '4px'
            }}>
              CURRENT TIME
            </div>
          </div>
        </div>

        {/* Calendar Icon & Date */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          flex: '1 1 auto',
          minWidth: '250px'
        }}>
          <div style={{
            fontSize: '48px',
            opacity: 0.9
          }}>
            📅
          </div>
          <div>
            <div style={{
              fontSize: '16px',
              fontWeight: '700',
              lineHeight: '1.4',
              letterSpacing: '0.5px'
            }}>
              {formatDate(time)}
            </div>
            <div style={{
              fontSize: '12px',
              opacity: 0.85,
              letterSpacing: '0.5px',
              marginTop: '4px'
            }}>
              TODAY'S DATE
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default LiveTime;
