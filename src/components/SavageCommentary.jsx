import React from 'react';

const SavageCommentary = ({ savageTruth }) => {
  return (
    <div className="card-hover-effect" style={{
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '24px',
      padding: '24px',
      textAlign: 'center',
      color: 'white',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
    }}>
      <h4 className="heading-font" style={{ 
        marginBottom: '12px', 
        fontSize: '18px', 
        fontWeight: 'bold', 
        background: 'linear-gradient(135deg, #f97316, #f59e0b)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        display: 'inline-block',
        textShadow: '0 0 8px rgba(245, 158, 11, 0.5)' /* Added text glow */
      }}>
        🔥 Savage Truth
      </h4>
      <p style={{fontStyle: 'italic', color: 'rgba(255, 255, 255, 0.8)'}}>
        {savageTruth || "The brutally honest insight will appear here."}
      </p>
    </div>
  );
};

export default SavageCommentary;