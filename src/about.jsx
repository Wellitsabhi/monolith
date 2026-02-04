import React from 'react';

const AboutPage = () => {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #001a0f 0%, #000814 50%, #000 100%)',
      padding: '40px 30px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background grid */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: `
          linear-gradient(rgba(0, 255, 136, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 255, 136, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
        opacity: 0.3,
        animation: 'gridMove 20s linear infinite'
      }} />

      {/* Content container */}
      <div style={{
        maxWidth: '1100px',
        width: '100%',
        lineHeight: '1.6',
        fontSize: 'clamp(12px, 1.2vw, 16px)',
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'space-between'
      }}>
        {/* Header */}
        <div>
          <h1 style={{
            fontSize: 'clamp(24px, 3.5vw, 48px)',
            marginBottom: '8px',
            color: '#00ff88',
            textShadow: '0 0 30px rgba(0, 255, 136, 0.5)',
            letterSpacing: '3px',
            fontWeight: 'bold'
          }}>
            ABOUT THE MONOLITH
          </h1>

          <div style={{
            fontSize: 'clamp(11px, 1vw, 14px)',
            color: '#00ff88',
            marginBottom: '20px',
            opacity: 0.7,
            letterSpacing: '2px'
          }}>
            Beyond the Portal • Another Dimension
          </div>
        </div>
        
        {/* Content paragraphs */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '15px 30px',
          marginBottom: '20px'
        }}>
          <p style={{ margin: 0, color: '#bbb', fontSize: 'clamp(11px, 1vw, 14px)' }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
          </p>
          
          <p style={{ margin: 0, color: '#bbb', fontSize: 'clamp(11px, 1vw, 14px)' }}>
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu 
            fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.
          </p>
        </div>

        {/* Feature boxes */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '15px',
          marginBottom: '20px'
        }}>
          <div style={{
            padding: '15px 20px',
            background: 'rgba(0, 255, 136, 0.05)',
            border: '1px solid rgba(0, 255, 136, 0.3)',
            borderRadius: '8px'
          }}>
            <h3 style={{
              fontSize: 'clamp(14px, 1.5vw, 20px)',
              marginBottom: '8px',
              color: '#00ff88'
            }}>
              Dimension Alpha
            </h3>
            <p style={{ color: '#999', fontSize: 'clamp(10px, 0.9vw, 13px)', margin: 0 }}>
              The first realm beyond the portal. Reality bends to consciousness 
              and time flows differently here.
            </p>
          </div>

          <div style={{
            padding: '15px 20px',
            background: 'rgba(0, 255, 136, 0.05)',
            border: '1px solid rgba(0, 255, 136, 0.3)',
            borderRadius: '8px'
          }}>
            <h3 style={{
              fontSize: 'clamp(14px, 1.5vw, 20px)',
              marginBottom: '8px',
              color: '#00ff88'
            }}>
              Quantum Matrix
            </h3>
            <p style={{ color: '#999', fontSize: 'clamp(10px, 0.9vw, 13px)', margin: 0 }}>
              The underlying structure connecting all dimensions. Navigate through 
              infinite possibilities and parallel realities.
            </p>
          </div>
        </div>

        {/* Welcome box */}
        <div style={{
          padding: '20px 25px',
          background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.1) 0%, rgba(0, 255, 136, 0.05) 100%)',
          border: '2px solid rgba(0, 255, 136, 0.4)',
          borderRadius: '12px',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: '20px'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '80px',
            height: '80px',
            background: 'radial-gradient(circle at top right, rgba(0, 255, 136, 0.2), transparent)',
            pointerEvents: 'none'
          }} />

          <h2 style={{
            fontSize: 'clamp(18px, 2vw, 28px)',
            marginBottom: '10px',
            color: '#00ff88',
            textShadow: '0 0 20px rgba(0, 255, 136, 0.3)'
          }}>
            Welcome to the Other Side
          </h2>
          <p style={{ color: '#aaa', lineHeight: '1.6', margin: 0, fontSize: 'clamp(11px, 1vw, 14px)' }}>
            You have successfully traversed through the dimensional portal. The journey 
            through space and time has brought you to this new realm of possibilities.
          </p>

          <div style={{
            marginTop: '12px',
            display: 'flex',
            gap: '10px',
            alignItems: 'center'
          }}>
            <div style={{
              width: '30px',
              height: '2px',
              background: 'linear-gradient(to right, #00ff88, transparent)'
            }} />
            <span style={{
              color: '#00ff88',
              fontSize: '10px',
              letterSpacing: '2px',
              opacity: 0.7
            }}>
              TRANSMISSION COMPLETE
            </span>
            <div style={{
              flex: 1,
              height: '2px',
              background: 'linear-gradient(to right, #00ff88, transparent)'
            }} />
          </div>
        </div>

        {/* Footer info */}
        <div style={{
          paddingTop: '15px',
          borderTop: '1px solid rgba(0, 255, 136, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '15px',
          fontSize: '12px',
          color: '#555'
        }}>
          <div><span style={{ color: '#00ff88' }}>Coordinates:</span> Unknown</div>
          <div><span style={{ color: '#00ff88' }}>Status:</span> Stable</div>
          <div><span style={{ color: '#00ff88' }}>Energy Level:</span> Optimal</div>
        </div>
      </div>

      <style>{`
        @keyframes gridMove {
          0% { transform: translateY(0); }
          100% { transform: translateY(50px); }
        }
      `}</style>
    </div>
  );
};

export default AboutPage;