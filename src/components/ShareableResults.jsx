import React from 'react';

const ShareableResults = ({ interest, actionItems }) => {
  const getHopeMessage = () => {
    if (interest < 30) {
      return "Low interest is a GIFT - now you can stop wasting time and find someone who's obsessed with you";
    } else if (interest < 60) {
      return "You're still in the game! Most relationships start lukewarm and build. Give it space to grow.";
    } else {
      return "This is RARE - genuine interest above 60%! Don't fumble this by overthinking.";
    }
  };

  return (
    <div style={{
      // No padding here, as it's handled by ReceiptCard
      color: 'white',
      fontFamily: 'sans-serif'
    }}>
      <div className="card-hover-effect" style={{
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '20px',
        background: 'rgba(255, 255, 255, 0.15)', // Slightly more opaque for clarity
        border: '1px solid rgba(255, 255, 255, 0.3)', // Subtle border
        boxShadow: '0 4px 10px rgba(0,0,0,0.2)' // Soft shadow
      }}>
        <h3 className="heading-font text-glow" style={{ fontSize: '18px', fontWeight: 'bold', opacity: 0.9, marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: '8px', fontSize: '24px' }}>🔍</span> The Reality Check
        </h3>
        <p style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>Interest Level: {interest}%</p>
        <p style={{ fontSize: '15px', opacity: 0.9 }}>
          They're {interest < 50 ? 'keeping options open' : 'genuinely considering you'}.
        </p>
      </div>

      <div className="card-hover-effect" style={{
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '20px',
        background: 'rgba(255, 255, 255, 0.15)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
      }}>
        <h3 className="heading-font text-glow" style={{ fontSize: '18px', fontWeight: 'bold', opacity: 0.9, marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: '8px', fontSize: '24px' }}>✨</span> The Silver Lining
        </h3>
        <p style={{ fontSize: '15px', lineHeight: '1.6' }}>{getHopeMessage()}</p>
      </div>

      <div className="card-hover-effect" style={{
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '20px',
        background: 'rgba(255, 255, 255, 0.15)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
      }}>
        <h3 className="heading-font text-glow" style={{ fontSize: '18px', fontWeight: 'bold', opacity: 0.9, marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: '8px', fontSize: '24px' }}>🎯</span> Your Next Move
        </h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {actionItems.map((item, index) => (
            <li key={index} style={{ fontSize: '15px', marginBottom: '10px', display: 'flex', alignItems: 'flex-start' }}>
              <span style={{ marginRight: '10px', fontSize: '20px', lineHeight: '1' }}>✅</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '10px' }}>
        <p style={{ fontSize: '18px', fontWeight: 'bold', fontStyle: 'italic', textShadow: '0 0 5px rgba(255,255,255,0.4)' }}>
          Remember: You're the prize. Act like it.
        </p>
      </div>
    </div>
  );
};

export default ShareableResults;