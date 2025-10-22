// src/components/exports/SocialCards.jsx
import React from 'react';
import sageLogo from '@/assets/sage-dark-circle.png';

// Helper function to safely truncate text
const truncate = (text, maxLength) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
};

// ============================================
// CARD 1: TRUTH RECEIPT (SCALED TO 1080x1920)
// ============================================
export function SocialReceiptCard({ analysis, archetype }) {
  if (!analysis) return null;
  
  // Debug logging
  console.log('📊 SocialReceiptCard received:', { analysis, archetype });
  console.log('📊 Full analysis object keys:', Object.keys(analysis));
  try { console.log('📊 Full analysis object:', JSON.stringify(analysis, null, 2)); } catch (e) {}
  
  // Extract ALL data dynamically from analysis object (NOT hardcoded)
  const wastingTime = analysis.wastingTime || 0;
  const actuallyIntoYou = analysis.actuallyIntoYou || 0;
  const redFlags = analysis.redFlags || 0;
  const verdict = analysis.verdict || '';
  const realTea = analysis.realTea || '';
  const prophecy = analysis.prophecy || '';
  // Ensure drama meter values are dynamic, clamped, and null-safe
  const rawConfidenceScore = Number(analysis?.confidenceScore);
  const confidenceScore = Number.isFinite(rawConfidenceScore)
    ? Math.min(100, Math.max(0, Math.round(rawConfidenceScore)))
    : 0;
  const confidenceRemark = (analysis?.confidenceRemark && String(analysis.confidenceRemark).trim())
    || getConfidenceRemark(confidenceScore);
  // Flag extraction now handled by getGuaranteedFlags() function below
  const yourMove = analysis.yourMove || [];
  const teaAndMovePlay = analysis.teaAndMovePlay || [];
  const userQuestion = analysis.userQuestion || '';
  const originalMessage = analysis.originalMessage || '';
  const gotThisPercentToday = analysis.gotThisPercentToday || Math.floor(Math.random() * 14) + 4;
  
  // Extract archetype emoji and clean text dynamically
  const extractEmojiAndText = (text) => {
    if (!text) return { text: '', emoji: '🔮' };
    const emojiMatch = text.match(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u);
    const emoji = emojiMatch ? emojiMatch[0] : '🔮';
    const cleanText = text.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '').trim();
    return { text: cleanText, emoji };
  };
  
  const { text: archetypeTitle, emoji: archetypeEmoji } = extractEmojiAndText(archetype);
  
  // Debug logging for archetype extraction
  console.log('📊 Archetype extraction:', { 
    original: archetype, 
    extractedTitle: archetypeTitle, 
    extractedEmoji: archetypeEmoji 
  });
  
  // Extract user question from originalMessage if not provided directly
  const extractUserQuestion = (message) => {
    if (!message) return null;
    const questionMatch = message.match(/YOUR QUESTION:\s*(.+?)(?:\n|$)/i);
    return questionMatch ? questionMatch[1].trim() : null;
  };
  
  const parsedUserQuestion = userQuestion || extractUserQuestion(originalMessage);
  
  // Desktop's exact health logic
  const overallHealth = (actuallyIntoYou || 0) - (wastingTime || 0);
  const isHealthy = overallHealth >= 60 || (actuallyIntoYou || 0) >= 80;
  
  // Desktop's exact flag selection logic
  const getGuaranteedFlags = () => {
    // Default flags that ALWAYS exist (with emojis to match AI format)
    const defaultGreenFlags = [
      "💬 Clear communication", "📅 Makes concrete plans", "💪 Consistent responses", 
      "👍 Shows genuine interest", "🛡️ Respects boundaries", "✅ Follow-through actions"
    ];
    
    const defaultRedFlags = [
      "🌊 Inconsistent communication", "💭 Vague future plans", "🎭 Hot and cold behavior", 
      "🚫 Avoids commitment talk", "⏰ Last minute changes", "📱 Limited availability"
    ];
    
    // Try to get flags from multiple sources
    let finalFlags = [];
    
    if (isHealthy) {
      // For healthy relationships - prioritize green flags
      finalFlags = analysis?.greenFlagChips?.filter(Boolean) || 
                   analysis?.redFlagChips?.filter(Boolean) ||
                   defaultGreenFlags.slice(0, 6);
    } else {
      // For unhealthy relationships - use red flags
      finalFlags = analysis?.redFlagChips?.filter(Boolean) || 
                   analysis?.deepDive?.red_flag_tags?.filter(Boolean) ||
                   analysis?.redFlagTags?.filter(Boolean) ||
                   (analysis?.receipts || []).map(r => r.pattern).filter(Boolean) ||
                   defaultRedFlags.slice(0, 6);
    }
    
    // ABSOLUTE GUARANTEE: If somehow still empty, use defaults
    if (!finalFlags || finalFlags.length === 0) {
      finalFlags = isHealthy ? defaultGreenFlags.slice(0, 6) : defaultRedFlags.slice(0, 6);
    }
    
    return finalFlags;
  };
  
  // Get guaranteed flags that will NEVER be empty (desktop's approach)
  const guaranteedFlags = getGuaranteedFlags();
  
  const color = redFlags >= 7 ? '#F87171' : redFlags >= 4 ? '#FB923C' : '#34D399';

  // Determine if this should show SAVAGE tag (dynamic based on multiple factors)
  const isSavage = redFlags >= 6 || wastingTime >= 80 || (redFlags >= 4 && wastingTime >= 70);

  // Derive a safe, dynamic confidence remark when none is provided
  function getConfidenceRemark(score) {
    if (score >= 85) return 'SURE THIS IS TOXIC AF';
    if (score >= 70) return "PRETTY SURE IT'S MESSY";
    if (score >= 50) return 'MIXED SIGNALS, STAY SHARP';
    if (score >= 30) return 'COULD BE OKAY, WATCH VIBES';
    return 'SEEMS HEALTHY, KEEP COMMUNICATING';
  }

  return (
    <div 
      id="social-receipt-card"
      style={{
        position: 'fixed',
        top: '-9999px',
        left: '-9999px',
        width: '1080px',
        height: '1920px',
        background: '#121212',
        padding: '45px 45px 23px 45px',
        boxSizing: 'border-box',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        color: '#ffffff',
        overflow: 'hidden',
        border: '5px solid rgba(26, 26, 26, 0.6)',
        borderRadius: '36px',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* SAVAGE Tag - Match Desktop */}
      {isSavage && (
        <div style={{
          position: 'absolute',
          top: '36px',
          right: '36px',
          zIndex: 20
        }}>
          <div style={{
            background: 'transparent',
            color: '#F87171',
            fontSize: '27px',
            fontWeight: '900',
            textTransform: 'uppercase',
            padding: '12px 24px',
            borderRadius: '24px',
            boxShadow: 'none',
            letterSpacing: '0.1em',
            border: 'none',
            textShadow: '0 3px 6px rgba(0,0,0,0.3)'
          }}>
            SAVAGE
          </div>
        </div>
      )}
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '30px', position: 'relative', zIndex: 50 }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '18px',
          background: 'rgba(0,0,0,0.35)',
          padding: '15px 27px',
          borderRadius: '36px',
          border: '2px solid rgba(255,255,255,0.12)',
          position: 'relative',
          zIndex: 50
        }}>
          <img 
            src={sageLogo}
            alt="Sage"
            style={{
              width: '83px',
              height: '83px',
              borderRadius: '50%',
              border: '3px solid rgba(20,184,166,0.6)',
              objectFit: 'cover',
              filter: 'brightness(1.2) contrast(1.1)',
              boxShadow: '0 0 33px rgba(20, 184, 166, 0.35)'
            }}
          />
          <span style={{
            color: '#14B8A6',
            fontWeight: '800',
            fontSize: '27px',
            letterSpacing: '0.12em'
          }}>
            SAGE'S RECEIPT
          </span>
        </div>
      </div>

      {/* Archetype - Match Desktop Design Exactly */}
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        {/* Archetype Title with Emoji */}
        <h1 style={{
          fontSize: '42px',
          fontWeight: '700',
          color: color,
          lineHeight: '1.1',
          margin: '0 0 6px 0',
          textShadow: '0 3px 15px rgba(0, 0, 0, 0.5), 0 0 45px rgba(20, 184, 166, 0.2)'
        }}>
          {truncate(archetypeTitle, 30)} {archetypeEmoji}
        </h1>
        {/* Engagement metric with person icon */}
        <div style={{
          fontSize: '27px',
          color: 'rgba(255,255,255,0.7)',
          marginTop: '24px',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px'
        }}>
          <span style={{ color: '#FFD700' }}>👥</span>
          <span>{gotThisPercentToday}% got this today</span>
        </div>
      </div>

      {/* Metrics Grid - Match Desktop Design */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '9px',
        marginBottom: '18px'
      }}>
        {/* Wasting Time */}
        <div style={{
          background: '#1A1A1A',
          border: '2px solid #333',
          borderRadius: '18px',
          padding: '18px 12px',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '27px',
            color: '#CCCCCC',
            marginBottom: '6px',
            letterSpacing: '0.05em',
            fontWeight: '600',
            textTransform: 'uppercase'
          }}>
            WASTING TIME
          </div>
          <div style={{
            fontSize: '48px',
            fontWeight: '800',
            color: '#F87171',
            marginBottom: '9px'
          }}>
            {wastingTime}%
          </div>
          <div style={{
            width: '100%',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '3px',
            height: '6px'
          }}>
            <div style={{
              background: '#F87171',
              height: '6px',
              borderRadius: '3px',
              width: `${wastingTime}%`
            }}></div>
          </div>
        </div>

        {/* Into You */}
        <div style={{
          background: '#1A1A1A',
          border: '2px solid #333',
          borderRadius: '18px',
          padding: '18px 12px',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '27px',
            color: '#CCCCCC',
            marginBottom: '6px',
            letterSpacing: '0.05em',
            fontWeight: '600',
            textTransform: 'uppercase'
          }}>
            INTO YOU
          </div>
          <div style={{
            fontSize: '48px',
            fontWeight: '800',
            color: '#4ADE80',
            marginBottom: '9px'
          }}>
            {actuallyIntoYou}%
          </div>
          <div style={{
            width: '100%',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '3px',
            height: '6px'
          }}>
            <div style={{
              background: '#4ADE80',
              height: '6px',
              borderRadius: '3px',
              width: `${actuallyIntoYou}%`
            }}></div>
          </div>
        </div>

        {/* Flags */}
        <div style={{
          background: '#1A1A1A',
          border: '2px solid #333',
          borderRadius: '18px',
          padding: '18px 12px',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '27px',
            color: '#CCCCCC',
            marginBottom: '6px',
            letterSpacing: '0.05em',
            fontWeight: '600',
            textTransform: 'uppercase'
          }}>
            RED FLAGS
          </div>
          <div style={{
            fontSize: '48px',
            fontWeight: '800',
            color: '#FB923C',
            marginBottom: '9px'
          }}>
            {redFlags}/10
          </div>
          <div style={{
            width: '100%',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '3px',
            height: '6px'
          }}>
            <div style={{
              background: '#FB923C',
              height: '6px',
              borderRadius: '3px',
              width: `${(redFlags / 10) * 100}%`
            }}></div>
          </div>
        </div>
      </div>

      {/* Desktop's guaranteed flags approach - single section */}
      {guaranteedFlags && guaranteedFlags.length > 0 && (
        <div style={{ marginBottom: '36px' }}>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{
              color: isHealthy ? '#4ADE80' : '#F87171',
              fontSize: '27px',
              fontWeight: '700',
              letterSpacing: '0.1em',
              marginBottom: '24px',
              textAlign: 'center'
            }}>
              {isHealthy ? '🟢 GREEN FLAGS' : '🚩 RED FLAGS'}
            </h3>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              justifyContent: 'center',
              maxWidth: '900px',
              margin: '0 auto'
            }}>
              {guaranteedFlags.slice(0, 6).map((chip, i) => (
                <div key={i} style={{
                  fontSize: '26px',
                  color: isHealthy ? 'rgba(16, 185, 129, 0.9)' : 'rgba(252, 165, 165, 0.9)',
                  fontWeight: '400',
                  padding: isHealthy ? '6px 12px' : '9px 15px',
                  background: 'transparent',
                  borderRadius: isHealthy ? '18px' : '24px',
                  border: 'none',
                  whiteSpace: 'nowrap',
                  boxShadow: 'none'
                }}>
                  {truncate(chip, isHealthy ? 30 : 25)}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Verdict Box - Match Desktop Design */}
      <div style={{
        background: 'rgba(0,0,0,0.3)',
        borderRadius: '18px',
        padding: '24px',
        marginBottom: '12px',
        border: '2px solid rgba(255,255,255,0.1)'
      }}>
        <h3 style={{
          color: '#2DD4BF',
          fontSize: '27px',
          fontWeight: '700',
          letterSpacing: '0.1em',
          margin: '0 0 18px 0',
          textShadow: '0 2px 5px rgba(0, 0, 0, 0.4)'
        }}>
          💡 SAGE'S TAKE
        </h3>
        <p style={{
          fontSize: '30px',
          lineHeight: '1.5',
          margin: '0',
          fontStyle: 'italic',
          color: 'rgba(255, 255, 255, 0.9)',
          fontWeight: '300'
        }}>
          {truncate(verdict, 300)}
        </p>
      </div>

      {/* Real Tea Box - Match Desktop Design with User Question */}
      {(realTea || yourMove.length > 0 || teaAndMovePlay.length > 0) && (
        <div style={{
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '18px',
          padding: '30px',
          marginBottom: '12px',
          border: '2px solid rgba(255,255,255,0.1)'
        }}>
          <h3 style={{
            color: '#2DD4BF',
            fontSize: '27px',
            fontWeight: '700',
            letterSpacing: '0.1em',
            margin: '0 0 18px 0',
            textShadow: '0 2px 5px rgba(0, 0, 0, 0.4)'
          }}>
            🛡️ THE BREAKDOWN
          </h3>
          <div>
            {/* User's Question (if provided) */}
            {parsedUserQuestion && (
              <div style={{
                marginBottom: '12px',
                paddingBottom: '18px',
                borderBottom: '2px solid rgba(255,255,255,0.1)'
              }}>
                <p style={{
                  color: '#FFD700',
                  fontSize: '27px',
                  fontWeight: '600',
                  margin: '0 0 9px 0'
                }}>
                  Your Question:
                </p>
                <p style={{
                  color: '#ffffff',
                  fontSize: '27px',
                  fontStyle: 'italic',
                  margin: '0',
                  lineHeight: '1.4'
                }}>
                  "{truncate(parsedUserQuestion, 80)}"
                </p>
              </div>
            )}
            
            {/* Main tea content - try realTea, then teaAndMovePlay, then yourMove */}
            {realTea ? (
              <p style={{
                fontSize: '30px',
                lineHeight: '1.5',
                margin: '0',
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: '300'
              }}>
                {truncate(realTea, 300)}
              </p>
            ) : teaAndMovePlay && Array.isArray(teaAndMovePlay) ? (
              <div>
                {teaAndMovePlay.slice(0, 2).map((line, index) => (
                  <p key={index} style={{
                    fontSize: '30px',
                    lineHeight: '1.5',
                    margin: '0 0 12px 0',
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontWeight: '300'
                  }}>
                    {truncate(line, 100)}
                  </p>
                ))}
              </div>
            ) : yourMove.length > 0 ? (
              <div>
                {yourMove.slice(0, 2).map((item, index) => (
                  <p key={index} style={{
                    fontSize: '33px',
                    lineHeight: '1.5',
                    margin: '0 0 12px 0',
                    color: '#ffffff',
                    fontWeight: '400'
                  }}>
                    • {truncate(item, 100)}
                  </p>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      )}


      {/* Sage's Prophecy - if available */}
      {prophecy && (
        <div style={{
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '18px',
          padding: '30px',
          marginBottom: '12px',
          border: '2px solid rgba(255,255,255,0.1)'
        }}>
          <h3 style={{
            color: '#2DD4BF',
            fontSize: '27px',
            fontWeight: '700',
            letterSpacing: '0.1em',
            margin: '0 0 18px 0',
            textShadow: '0 2px 5px rgba(0, 0, 0, 0.4)'
          }}>
            🔮 SAGE BETS...
          </h3>
          <p style={{
            fontSize: '30px',
            lineHeight: '1.5',
            margin: '0',
            color: 'rgba(255, 255, 255, 0.9)',
            fontWeight: '300'
          }}>
            {truncate(prophecy, 300)}
          </p>
        </div>
      )}

      {/* Sage's Drama Meter - Match Desktop Design */}
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '18px',
        padding: '24px',
        marginBottom: '12px',
        border: '2px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px'
        }}>
          <h3 style={{
            color: '#2DD4BF',
            fontSize: '27px',
            fontWeight: '700',
            letterSpacing: '0.1em',
            margin: '0 0 18px 0',
            textShadow: '0 2px 5px rgba(0, 0, 0, 0.4)'
          }}>
            🧠 SAGE'S DRAMA METER
          </h3>
          <span style={{
            fontSize: '27px',
            fontWeight: '700',
            color: '#22D3EE'
          }}>
            {confidenceScore}%
          </span>
        </div>
        <div style={{
          width: '100%',
          background: '#374151',
          borderRadius: '6px',
          height: '12px',
          marginBottom: '6px'
        }}>
          <div style={{
            background: '#22D3EE',
            height: '12px',
            borderRadius: '6px',
            width: `${confidenceScore}%`,
            transition: 'width 0.5s ease'
          }}></div>
        </div>
        <div style={{
          textAlign: 'center'
        }}>
          <span style={{
            fontSize: '27px',
            fontWeight: '300',
            color: '#67E8F9'
          }}>
            {confidenceRemark}
          </span>
        </div>
      </div>

      {/* Spacer to push footer to bottom */}
      <div style={{ flexGrow: 1 }}></div>
      
      {/* High-End Viral CTA Footer */}
      <div style={{
        textAlign: 'center',
        marginTop: '3px',
        background: 'transparent',
        borderRadius: '24px',
        padding: '9px 18px',
        border: 'none',
        boxShadow: 'none'
      }}>
        <div style={{
          fontSize: '24px',
          color: '#67E8F9',
          letterSpacing: '0.08em',
          fontWeight: '200',
          marginBottom: '9px',
          textShadow: '0 0 12px rgba(103, 232, 249, 0.3)',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          opacity: '0.9'
        }}>
          🎯 free receipts: 2.3M chats decoded 🎯
        </div>
        <div style={{
          fontSize: '21px',
          color: '#94A3B8',
          letterSpacing: '0.12em',
          fontWeight: '200',
          textDecoration: 'none',
          textShadow: 'none',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          opacity: '0.7'
        }}>
          www.getthereceipts.com
        </div>
      </div>
    </div>
  );
}

// ============================================
// CARD 2: PLAYBOOK (SCALED TO 1080x1920)
// ============================================
export function SocialPlaybookCard({ deepDive, archetype, analysis }) {
  if (!deepDive) return null;
  
  // Dynamic + null-safe extraction
  const firstReceipt = (deepDive?.receipts && deepDive.receipts[0]) || {};
  const next48h = deepDive?.playbook?.next_48h || deepDive?.next_48h || '';
  const yourMoveRaw = deepDive?.playbook?.your_move || deepDive?.your_move || '';
  const moves = Array.isArray(yourMoveRaw)
    ? yourMoveRaw.filter(Boolean)
    : String(yourMoveRaw).split('.').map(s => s.trim()).filter(Boolean);
  const seal = deepDive?.sages_seal || deepDive?.seal || '';
  const vibeCheck = firstReceipt?.vibe_check || deepDive?.vibe_check || '';
  const playbookTitle = deepDive?.title || archetype || '';
  const playbookSubtitle = deepDive?.verdict?.subtext || deepDive?.subtitle || deepDive?.summary || '';
  
  // Get dynamic archetype color based on red flags (matching desktop logic)
  const redFlags = analysis?.redFlags || 0;
  const archetypeColor = redFlags >= 8 ? '#F87171' : redFlags >= 4 ? '#FB923C' : '#34D399';

  return (
    <div 
      id="social-playbook-card"
      style={{
        position: 'fixed',
        top: '-9999px',
        left: '-9999px',
        width: '1080px',
        height: '1920px',
        background: '#121212',
        padding: '45px 45px 23px 45px',
        boxSizing: 'border-box',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        color: '#ffffff',
        overflow: 'hidden',
        border: '5px solid rgba(26, 26, 26, 0.6)',
        borderRadius: '36px'
      }}
    >
      {/* Top right corner */}
      <div style={{
        position: 'absolute',
        top: '30px',
        right: '30px',
        fontSize: '24px',
        fontWeight: '700',
        color: '#C084FC',
        letterSpacing: '0.08em'
      }}>
        <span style={{ fontSize: '27px' }}>🔒</span> PREMIUM
      </div>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '18px', position: 'relative', zIndex: 50 }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '18px',
          background: 'rgba(0,0,0,0.35)',
          padding: '15px 27px',
          borderRadius: '36px',
          border: '2px solid rgba(255,255,255,0.12)',
          position: 'relative',
          zIndex: 50
        }}>
          <img 
            src={sageLogo}
            alt="Sage"
            style={{
              width: '83px',
              height: '83px',
              borderRadius: '50%',
              border: '3px solid rgba(20,184,166,0.6)',
              objectFit: 'cover',
              filter: 'brightness(1.2) contrast(1.1)',
              boxShadow: '0 0 33px rgba(20, 184, 166, 0.35)'
            }}
          />
          <span style={{
            color: '#A855F7',
            fontWeight: '800',
            fontSize: '27px',
            letterSpacing: '0.12em'
          }}>
            SAGE'S PLAYBOOK
          </span>
        </div>
      </div>

      {/* Title + subtitle */}
      <h1 style={{
        fontSize: '39px',
        fontWeight: '700',
        textAlign: 'center',
        margin: '0 0 24px 0',
        color: archetypeColor,
        lineHeight: '1.2',
        padding: '0 30px',
        position: 'relative',
        zIndex: 4
      }}>
        {truncate(playbookTitle, 32)}
      </h1>
      {playbookSubtitle && (
        <div style={{
          textAlign: 'center',
          color: 'rgba(231,229,228,0.85)',
          fontSize: '27px',
          fontWeight: '300',
          marginBottom: '18px',
          lineHeight: '1.4',
          position: 'relative',
          zIndex: 4
        }}>
          {truncate(playbookSubtitle, 90)}
        </div>
      )}
      
      {/* HOT • TAKES • SERVED badges */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        gap: '21px',
        padding: '8px 18px',
        borderRadius: '21px',
        background: 'transparent',
        border: 'none',
        margin: '0 0 24px 0',
        position: 'relative',
        zIndex: 50
      }}>
        <span style={{ color: '#F59E0B' }}>• HOT •</span>
        <span style={{ color: '#A855F7' }}>• TAKES •</span>
        <span style={{ color: '#F59E0B' }}>• SERVED •</span>
      </div>
      
      {/* Gold accent line */}
      <div style={{
        width: '420px',
        height: '5px',
        background: 'linear-gradient(90deg, transparent, #FFD700, transparent)',
        margin: '30px auto 24px auto',
        borderRadius: '3px'
      }}>
      </div>

      {/* Autopsy mini header bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: '12px 0 20px 0'
      }}>
        <div style={{ color: '#A855F7', fontSize: '27px', fontWeight: '800', letterSpacing: '0.12em' }}>• THE AUTOPSY</div>
        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '17px', letterSpacing: '0.12em', fontWeight: '400' }}>EVIDENCE COLLECTED</div>
      </div>

      {/* Receipt Autopsy */}
      <div style={{
        background: 'rgba(0,0,0,0.40)',
        borderRadius: '24px',
        padding: '48px',
        marginBottom: '45px',
        border: '2px solid rgba(251,191,36,0.55)'
      }}>
        <div style={{
          fontSize: '30px',
          fontStyle: 'italic',
          marginBottom: '30px',
          lineHeight: '1.5',
          color: 'rgba(231,229,228,0.85)',
          textAlign: 'center',
          fontWeight: '400'
        }}>
          {firstReceipt?.quote ? `💬 "${truncate(firstReceipt.quote, 140)}"` : ''}
        </div>
        {/* Subtle divider under quote */}
        <div style={{
          height: '2px',
          background: 'rgba(255,255,255,0.08)',
          margin: '20px 0 27px 0'
        }}></div>
        <div style={{
          fontSize: '27px',
          color: '#14B8A6',
          fontWeight: '700',
          marginBottom: '9px'
        }}>
          THE TACTIC
        </div>
        <div style={{
          fontSize: '27px',
          marginBottom: '12px',
          lineHeight: '1.5',
          color: 'rgba(231,229,228,0.85)',
          fontWeight: '300',
          wordSpacing: '0.1em',
          whiteSpace: 'pre-wrap'
        }}>
          {truncate(firstReceipt?.bestie_look || firstReceipt?.tactic || '', 300)}
        </div>
        <div style={{
          fontSize: '27px',
          color: '#14B8A6',
          fontWeight: '700',
          marginBottom: '9px'
        }}>
          CALLING IT
        </div>
        <div style={{
          fontSize: '27px',
          lineHeight: '1.5',
          color: 'rgba(231,229,228,0.85)',
          fontWeight: '400'
        }}>
          {truncate(firstReceipt?.calling_it || firstReceipt?.calling || '', 120)}
        </div>
        {/* Vibe Check */}
        <div style={{
          fontSize: '27px',
          color: '#14B8A6',
          fontWeight: '700',
          margin: '21px 0 12px 0'
        }}>
          VIBE CHECK
        </div>
        <div style={{ fontSize: '24px', lineHeight: '1.5', color: 'rgba(231,229,228,0.85)', fontWeight: '400' }}>
          {truncate(vibeCheck, 140)}
        </div>
      </div>

      {/* SAGE'S PLAYBOOK STRATEGIC MOVES */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '0 0 24px 0'
      }}>
        <div style={{ color: '#A855F7', fontSize: '27px', fontWeight: '800', letterSpacing: '0.12em' }}>• THE GAME PLAN</div>
        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '17px', letterSpacing: '0.12em', fontWeight: '400' }}>STRATEGIC MOVES</div>
      </div>
      {/* Two-column Playbook section (desktop parity) */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '36px', marginBottom: '36px'
      }}>
        {/* NEXT 48 HOURS */}
        <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '21px', padding: '32px', border: '2px solid rgba(212,175,55,0.35)' }}>
          <h3 style={{ color: '#FBBF24', fontSize: '21px', fontWeight: '600', letterSpacing: '0.08em', margin: '0 0 15px 0' }}>⏰ NEXT 48 HOURS</h3>
          <p style={{ fontSize: '26px', lineHeight: '1.5', margin: '0', color: 'rgba(231,229,228,0.85)', fontWeight: '400', wordSpacing: '0.1em', whiteSpace: 'pre-wrap' }}>
            {truncate(next48h, 200)}
          </p>
        </div>
        {/* YOUR MOVES */}
        <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '21px', padding: '32px', border: '2px solid rgba(212,175,55,0.35)' }}>
          <h3 style={{ color: '#FBBF24', fontSize: '21px', fontWeight: '600', letterSpacing: '0.08em', margin: '0 0 15px 0' }}>🎯 YOUR MOVES</h3>
          <div style={{ fontSize: '26px', lineHeight: '1.5', color: 'rgba(231,229,228,0.85)', fontWeight: '400' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <span style={{ color: 'rgba(20,184,166,0.7)', fontWeight: 700, fontSize: '26px', lineHeight: '1.5', flexShrink: 0, marginTop: '3px' }}>&gt;</span>
              <span style={{ wordSpacing: '0.1em', whiteSpace: 'pre-wrap' }}>{truncate(moves[0] || '', 90)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* SAGE'S SEAL FINAL WISDOM */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '8px 0 20px 0' }}>
        <div style={{ color: '#A855F7', fontSize: '27px', fontWeight: '800', letterSpacing: '0.12em' }}>• SAGE'S SEAL</div>
        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '17px', letterSpacing: '0.12em', fontWeight: '400' }}>FINAL WISDOM</div>
      </div>
      {/* Sage's Seal */}
      <div style={{
        background: 'rgba(0,0,0,0.3)',
        borderRadius: '21px',
        padding: '32px',
        marginBottom: '18px',
        textAlign: 'center',
        border: '2px solid rgba(212,175,55,0.35)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minHeight: '270px'
      }}>
        <div style={{ position: 'absolute', right: '15px', top: '15px', fontSize: '36px', opacity: 0.9 }}>✨</div>
        <div style={{ position: 'absolute', left: '15px', bottom: '15px', fontSize: '27px', opacity: 0.9 }}>✨</div>
        <div style={{ fontSize: '42px', marginBottom: '15px' }}>👑</div>
        <div style={{
          fontSize: '27px',
          color: '#FBBF24',
          fontWeight: '700',
          marginBottom: '20px',
          letterSpacing: '0.1em',
          textShadow: '0 2px 5px rgba(0, 0, 0, 0.3)'
        }}>
          SAGE'S SEAL
        </div>
        <p style={{
          fontSize: '27px',
          lineHeight: '1.5',
          margin: '0 0 18px 0',
          color: '#FBBF24',
          fontStyle: 'italic',
          fontWeight: '300',
          textShadow: '0 2px 5px rgba(0, 0, 0, 0.3)'
        }}>
          "{truncate(seal, 120)}"
        </p>
      </div>

      {/* High-End Viral CTA Footer (match receipt) */}
      <div style={{
        textAlign: 'center',
        marginTop: '6px',
        background: 'transparent',
        borderRadius: '24px',
        padding: '9px 18px',
        border: 'none',
        boxShadow: 'none'
      }}>
        <div style={{
          fontSize: '24px',
          color: '#67E8F9',
          letterSpacing: '0.08em',
          fontWeight: '200',
          marginBottom: '9px',
          textShadow: '0 0 12px rgba(103, 232, 249, 0.3)',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          opacity: '0.9'
        }}>
          🎯 free receipts: 2.3M chats decoded 🎯
        </div>
        <div style={{
          fontSize: '21px',
          color: '#94A3B8',
          letterSpacing: '0.12em',
          fontWeight: '200',
          textDecoration: 'none',
          textShadow: 'none',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          opacity: '0.7'
        }}>
          www.getthereceipts.com
        </div>
      </div>
    </div>
  );
}

// ============================================
// CARD 3: IMMUNITY TRAINING (SCALED TO 1080x1920)
// ============================================
export function SocialImmunityCard({ immunityData, archetype, analysis }) {
  if (!immunityData) return null;
  
  // Extract archetype emoji and clean text dynamically
  const extractEmojiAndText = (text) => {
    if (!text) return { text: '', emoji: '🔮' };
    
    // Extract emoji
    const emojiMatch = text.match(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u);
    const emoji = emojiMatch ? emojiMatch[0] : '🔮';
    
    // Remove emoji and clean up
    let cleanText = text.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '').trim();
    
    // Remove "The " prefix
    cleanText = cleanText.replace(/^The\s+/i, '');
    
    // Split camelCase and PascalCase (e.g., "CalendarKing" → "Calendar King")
    cleanText = cleanText.replace(/([a-z])([A-Z])/g, '$1 $2');
    
    // Additional check for consecutive capitals (e.g., "ABC" → "A B C")
    cleanText = cleanText.replace(/([A-Z])([A-Z][a-z])/g, '$1 $2');
    
    // Replace hyphens and underscores with spaces
    cleanText = cleanText.replace(/[-_]+/g, ' ');
    
    // Clean up multiple spaces
    cleanText = cleanText.replace(/\s+/g, ' ').trim();
    
    return { text: cleanText, emoji };
  };
  
  const { text: archetypeTitle, emoji: archetypeEmoji } = extractEmojiAndText(archetype);
  
  const patternLoop = immunityData.patternLoop || [];
  const greenFlags = immunityData.greenFlags || [];
  const thisMessFlags = immunityData.thisMessFlags || [];
  const immunityTraining = immunityData.immunityTraining || [];
  const sageBlessing = immunityData.sageBlessing || '';
  
  // Get dynamic archetype color based on original analysis red flags (not immunity analysis)
  const redFlags = analysis?.redFlags || 0;
  const archetypeColor = '#A855F7'; // Purple for all archetypes

  return (
    <div 
      id="social-immunity-card"
      style={{
        position: 'fixed',
        top: '-9999px',
        left: '-9999px',
        width: '1080px',
        height: '1920px',
        background: '#121212',
        padding: '45px 45px 23px 45px',
        boxSizing: 'border-box',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        color: '#ffffff',
        overflow: 'hidden',
        border: 'none',
        borderRadius: '36px'
      }}
    >
      {/* Top right corner (Immunity) */}
      <div style={{
        position: 'absolute',
        top: '30px',
        right: '30px',
        fontSize: '33px',
        fontWeight: '700',
        color: '#F4A623',
        letterSpacing: '0.08em'
      }}>
        <span style={{ fontSize: '39px' }}>👑</span> ELITE
      </div>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '30px', position: 'relative', zIndex: 50 }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '18px',
          background: 'rgba(0,0,0,0.35)',
          padding: '15px 27px',
          borderRadius: '36px',
          border: '2px solid rgba(255,255,255,0.12)',
          position: 'relative',
          zIndex: 50
        }}>
          <img 
            src={sageLogo}
            alt="Sage"
            style={{
              width: '83px',
              height: '83px',
              borderRadius: '50%',
              border: '3px solid rgba(20,184,166,0.6)',
              objectFit: 'cover',
              filter: 'brightness(1.2) contrast(1.1)',
              boxShadow: '0 0 33px rgba(20, 184, 166, 0.35)'
            }}
          />
          <span style={{
            color: '#A855F7',
            fontWeight: '800',
            fontSize: '27px',
            letterSpacing: '0.12em'
          }}>
            IMMUNITY TRAINING
          </span>
        </div>
      </div>

      {/* Archetype - Match Desktop Design Exactly */}
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        {/* Archetype Title with Emoji */}
        <h1 style={{
          fontSize: '42px',
          fontWeight: '700',
          color: archetypeColor,
          lineHeight: '1.1',
          margin: '0 0 6px 0',
          textShadow: '0 3px 15px rgba(0, 0, 0, 0.5), 0 0 45px rgba(20, 184, 166, 0.2)'
        }}>
          Pattern Verified: {truncate(archetypeTitle, 30)} {archetypeEmoji}
        </h1>
      </div>

      {/* What This Looks Like */}
      <div style={{
        background: 'rgba(0,0,0,0.3)',
        borderRadius: '24px',
        padding: '27px',
        marginBottom: '33px',
        border: '2px solid rgba(255,215,0,0.5)',
        boxShadow: '0 3px 12px rgba(0,0,0,0.15)'
      }}>
        <h3 style={{
          color: '#14B8A6',
          fontSize: '24px',
          fontWeight: '700',
          letterSpacing: '0.08em',
          margin: '0 0 24px 0'
        }}>
          🧬 WHAT THIS LOOKS LIKE
        </h3>
        <p style={{
          fontSize: '27px',
          lineHeight: '1.5',
          margin: '0',
          color: 'rgba(231,229,228,0.85)',
          fontWeight: '300',
          textAlign: 'center'
        }}>
          {truncate(immunityData?.patternDNA || immunityData?.description || immunityData?.summary || 'Pattern analysis in progress...', 150)}
        </p>
      </div>

      {/* The Cycle */}
      <div style={{
        background: 'rgba(0,0,0,0.3)',
        borderRadius: '21px',
        padding: '27px',
        marginBottom: '27px',
        border: '2px solid rgba(255,215,0,0.5)',
        boxShadow: '0 3px 12px rgba(0,0,0,0.15)'
      }}>
        <h3 style={{
          color: '#14B8A6',
          fontSize: '24px',
          fontWeight: '700',
          letterSpacing: '0.08em',
          margin: '0 0 18px 0'
        }}>
          🔄 THE CYCLE
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {patternLoop.slice(0, 4).map((step, i) => (
            <React.Fragment key={i}>
              <div style={{
                flex: '1',
                background: 'rgba(255,255,255,0.05)',
                padding: '18px 12px',
                borderRadius: '12px',
                fontSize: '26px',
                textAlign: 'center',
                lineHeight: '1.3',
                border: '2px solid rgba(255,215,0,0.3)',
                color: '#E5E7EB',
                minHeight: '120px',
                display: 'block',
                whiteSpace: 'pre-wrap',
                fontWeight: '200'
              }}>
                {truncate(step, 60)}
              </div>
              {i < 3 && <span style={{ color: '#ff7f7f', fontSize: '27px', flexShrink: '0' }}>→</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* See Both Sides */}
      <div style={{
        background: 'rgba(0,0,0,0.4)',
        borderRadius: '21px',
        padding: '32px',
        marginBottom: '27px',
        border: '2px solid rgba(255,215,0,0.5)',
        boxShadow: '0 3px 12px rgba(0,0,0,0.15)'
      }}>
        <div style={{
          fontSize: '24px',
          color: '#14B8A6',
          fontWeight: '700',
          marginBottom: '12px',
          letterSpacing: '0.05em'
        }}>
          ⚖️ SEE BOTH SIDES
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
          {/* Green Flags */}
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '15px',
            padding: '18px',
            border: 'none'
          }}>
            {greenFlags.slice(0, 2).map((flag, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                marginBottom: '20px',
                fontSize: '27px',
                lineHeight: '1.5',
                color: 'rgba(231,229,228,0.85)',
                fontWeight: '200'
              }}>
                <span style={{ color: '#14B8A6', fontSize: '27px', marginRight: '12px' }}>✔</span>
                <span style={{ display: 'inline-block', whiteSpace: 'normal', wordBreak: 'break-word', overflowWrap: 'anywhere', color: 'rgba(231,229,228,0.85)' }}>
                  {truncate(flag.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '').trim(), 110)}
                </span>
              </div>
            ))}
          </div>
          {/* Red Flags */}
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '15px',
            padding: '18px',
            border: 'none'
          }}>
            {thisMessFlags.slice(0, 2).map((flag, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                marginBottom: '20px',
                fontSize: '27px',
                lineHeight: '1.5',
                color: 'rgba(231,229,228,0.85)',
                fontWeight: '200'
              }}>
                <span style={{ color: '#EF4444', fontSize: '27px', marginRight: '12px' }}>🚩</span>
                <span style={{ display: 'inline-block', whiteSpace: 'normal', wordBreak: 'break-word', overflowWrap: 'anywhere', color: 'rgba(231,229,228,0.85)' }}>
                  {truncate(flag.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '').trim(), 110)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Training */}
      <div style={{
        background: 'rgba(0,0,0,0.3)',
        borderRadius: '21px',
        padding: '27px',
        marginBottom: '27px',
        border: '2px solid rgba(255,215,0,0.5)',
        boxShadow: '0 3px 12px rgba(0,0,0,0.15)'
      }}>
        <h3 style={{
          color: '#14B8A6',
          fontSize: '24px',
          fontWeight: '700',
          letterSpacing: '0.08em',
          margin: '0 0 12px 0'
        }}>
          🛡️ YOUR TRAINING
        </h3>
        <p style={{
          fontSize: '27px',
          lineHeight: '1.5',
          margin: '0',
          color: 'rgba(231,229,228,0.85)',
          fontWeight: '300',
          textAlign: 'center'
        }}>
          {truncate(immunityTraining[0] || '', 200)}
        </p>
      </div>

      {/* Sage's Blessing */}
      <div style={{
        background: 'rgba(0,0,0,0.45)',
        borderRadius: '24px',
        padding: '5px 36px 30px 36px',
        marginBottom: '12px',
        textAlign: 'center',
        border: '2px solid rgba(255,215,0,0.5)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        boxShadow: '0 3px 12px rgba(0,0,0,0.15)'
      }}>
        <div style={{ position: 'absolute', right: '15px', top: '15px', fontSize: '36px', opacity: 0.9 }}>✨</div>
        <div style={{ position: 'absolute', left: '15px', bottom: '15px', fontSize: '27px', opacity: 0.9 }}>✨</div>
        <div style={{ fontSize: '42px', marginBottom: '15px' }}>👑</div>
        <div style={{
          fontSize: '26px',
          color: '#A855F7',
          fontWeight: '600',
          marginBottom: '20px',
          letterSpacing: '0.08em',
          textShadow: '0 2px 5px rgba(0, 0, 0, 0.3)'
        }}>
          SAGE'S BLESSING
        </div>
        <p style={{
          fontSize: '27px',
          lineHeight: '1.5',
          margin: '0 0 30px 0',
          padding: '0 30px',
          color: '#A855F7',
          fontStyle: 'italic',
          fontWeight: '100',
          textShadow: '0 2px 5px rgba(0, 0, 0, 0.3)'
        }}>
          "{truncate(sageBlessing, 300)}"
        </p>
      </div>

      {/* High-End Viral CTA Footer (match receipt) */}
      <div style={{
        textAlign: 'center',
        marginTop: '6px',
        background: 'transparent',
        borderRadius: '24px',
        padding: '9px 18px',
        border: 'none',
        boxShadow: 'none'
      }}>
        <div style={{
          fontSize: '24px',
          color: '#67E8F9',
          letterSpacing: '0.08em',
          fontWeight: '200',
          marginBottom: '9px',
          textShadow: '0 0 12px rgba(103, 232, 249, 0.3)',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          opacity: '0.9'
        }}>
          🎯 free receipts: 2.3M chats decoded 🎯
        </div>
        <div style={{
          fontSize: '21px',
          color: '#94A3B8',
          letterSpacing: '0.12em',
          fontWeight: '200',
          textDecoration: 'none',
          textShadow: 'none',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          opacity: '0.7'
        }}>
          www.getthereceipts.com
        </div>
      </div>
    </div>
  );
}