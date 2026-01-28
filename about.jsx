import React from 'react';

/**
 * ABOUT PAGE COMPONENT
 * Destination page after traveling through the portal
 * Shows after the 3D wave transition completes
 */
const AboutPage = () => {
  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: 'linear-gradient(135deg, #001a0f 0%, #000814 50%, #000 100%)',
      padding: '80px 20px',
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
        maxWidth: '900px',
        margin: '0 auto',
        lineHeight: '1.8',
        fontSize: 'clamp(14px, 1.5vw, 18px)',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Main heading */}
        <h1 style={{
          fontSize: 'clamp(32px, 4vw, 56px)',
          marginBottom: '20px',
          color: '#00ff88',
          textShadow: '0 0 30px rgba(0, 255, 136, 0.5)',
          letterSpacing: '3px',
          fontWeight: 'bold',
          animation: 'fadeInUp 1s ease-out'
        }}>
          ABOUT THE MONOLITH
        </h1>

        {/* Subtitle */}
        <div style={{
          fontSize: 'clamp(14px, 1.2vw, 16px)',
          color: '#00ff88',
          marginBottom: '40px',
          opacity: 0.7,
          letterSpacing: '2px',
          animation: 'fadeInUp 1s ease-out 0.2s backwards'
        }}>
          Beyond the Portal • Another Dimension
        </div>
        
        {/* Content paragraphs */}
        <div style={{ animation: 'fadeInUp 1s ease-out 0.4s backwards' }}>
          <p style={{ marginBottom: '24px', color: '#ccc' }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          
          <p style={{ marginBottom: '24px', color: '#ccc' }}>
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu 
            fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in 
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
          
          <p style={{ marginBottom: '24px', color: '#ccc' }}>
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque 
            laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi 
            architecto beatae vitae dicta sunt explicabo.
          </p>
          
          <p style={{ marginBottom: '24px', color: '#ccc' }}>
            Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia 
            consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro 
            quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.
          </p>
        </div>

        {/* Feature boxes */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginTop: '40px',
          animation: 'fadeInUp 1s ease-out 0.6s backwards'
        }}>
          <div style={{
            padding: '25px',
            background: 'rgba(0, 255, 136, 0.05)',
            border: '1px solid rgba(0, 255, 136, 0.3)',
            borderRadius: '8px',
            transition: 'all 0.3s ease'
          }}>
            <h3 style={{
              fontSize: 'clamp(18px, 2vw, 24px)',
              marginBottom: '15px',
              color: '#00ff88'
            }}>
              Dimension Alpha
            </h3>
            <p style={{ color: '#aaa', fontSize: '14px' }}>
              The first realm beyond the portal. A place where reality bends to the will 
              of consciousness and time flows differently.
            </p>
          </div>

          <div style={{
            padding: '25px',
            background: 'rgba(0, 255, 136, 0.05)',
            border: '1px solid rgba(0, 255, 136, 0.3)',
            borderRadius: '8px',
            transition: 'all 0.3s ease'
          }}>
            <h3 style={{
              fontSize: 'clamp(18px, 2vw, 24px)',
              marginBottom: '15px',
              color: '#00ff88'
            }}>
              Quantum Matrix
            </h3>
            <p style={{ color: '#aaa', fontSize: '14px' }}>
              The underlying structure that connects all dimensions. Navigate through 
              infinite possibilities and parallel realities.
            </p>
          </div>
        </div>

        {/* Welcome box */}
        <div style={{
          marginTop: '60px',
          padding: '30px',
          background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.1) 0%, rgba(0, 255, 136, 0.05) 100%)',
          border: '2px solid rgba(0, 255, 136, 0.4)',
          borderRadius: '12px',
          position: 'relative',
          overflow: 'hidden',
          animation: 'fadeInUp 1s ease-out 0.8s backwards'
        }}>
          {/* Animated corner accent */}
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '100px',
            height: '100px',
            background: 'radial-gradient(circle at top right, rgba(0, 255, 136, 0.2), transparent)',
            pointerEvents: 'none'
          }} />

          <h2 style={{
            fontSize: 'clamp(24px, 3vw, 36px)',
            marginBottom: '20px',
            color: '#00ff88',
            textShadow: '0 0 20px rgba(0, 255, 136, 0.3)'
          }}>
            Welcome to the Other Side
          </h2>
          <p style={{ color: '#bbb', lineHeight: '1.8' }}>
            You have successfully traversed through the dimensional portal. This is a 
            placeholder for your destination content. The journey through space and time 
            has brought you to this new realm of possibilities. What you do next is entirely 
            up to your imagination.
          </p>

          {/* Decorative tech lines */}
          <div style={{
            marginTop: '20px',
            display: 'flex',
            gap: '10px',
            alignItems: 'center'
          }}>
            <div style={{
              width: '40px',
              height: '2px',
              background: 'linear-gradient(to right, #00ff88, transparent)'
            }} />
            <span style={{
              color: '#00ff88',
              fontSize: '12px',
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
          marginTop: '60px',
          paddingTop: '30px',
          borderTop: '1px solid rgba(0, 255, 136, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
          fontSize: '14px',
          color: '#666',
          animation: 'fadeInUp 1s ease-out 1s backwards'
        }}>
          <div>
            <span style={{ color: '#00ff88' }}>Coordinates:</span> Unknown
          </div>
          <div>
            <span style={{ color: '#00ff88' }}>Status:</span> Stable
          </div>
          <div>
            <span style={{ color: '#00ff88' }}>Energy Level:</span> Optimal
          </div>
        </div>
      </div>

      {/* Floating particles effect */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes gridMove {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(50px);
          }
        }

        /* Hover effects for feature boxes */
        div:has(> h3) {
          cursor: pointer;
        }
        
        div:has(> h3):hover {
          background: rgba(0, 255, 136, 0.1) !important;
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 255, 136, 0.2);
        }
      `}</style>
    </div>
  );
};

export default AboutPage;