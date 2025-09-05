import React from 'react';

const ActionPlan = ({ nextMove }) => {
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
          background: 'linear-gradient(135deg, #14b8a6, #2dd4bf)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginRight: '10px',
          fontSize: '24px'
        }}>🎯</span>
        Your Next Move
      </h3>
      <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '15px', fontStyle: 'italic' }}>
        {nextMove || "Specific advice will appear here."}
      </p>
    </div>
  );
};

export default ActionPlan;