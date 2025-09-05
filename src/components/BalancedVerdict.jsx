import React from 'react';

const BalancedVerdict = ({ realityCheck, silverLining }) => {
  return (
    <div className="card-hover-effect" style={{
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '24px',
      padding: '24px',
      color: 'white',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
    }}>
      <h3 className="heading-font text-glow" style={{ marginBottom: '16px', fontSize: '18px', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
        <span style={{
          background: 'linear-gradient(135deg, #a8edea, #fed6e3)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginRight: '10px',
          fontSize: '24px'
        }}>⚖️</span>
        The Balanced Verdict
      </h3>
      <div style={{ marginBottom: '12px' }}>
        <p style={{ fontSize: '14px', marginBottom: '4px', color: '#ff8a80', fontWeight: 'bold' }}>
          THE REALITY CHECK:
        </p>
        <p style={{ fontSize: '15px', fontStyle: 'italic', color: 'rgba(255,255,255,0.9)' }}>
          {realityCheck || "An honest assessment will appear here."}
        </p>
      </div>
      <div>
        <p style={{ fontSize: '14px', marginBottom: '4px', color: '#82e9de', fontWeight: 'bold' }}>
          THE SILVER LINING:
        </p>
        <p style={{ fontSize: '15px', fontStyle: 'italic', color: 'rgba(255,255,255,0.9)' }}>
          {silverLining || "A positive perspective will appear here."}
        </p>
      </div>
    </div>
  );
};

export default BalancedVerdict;