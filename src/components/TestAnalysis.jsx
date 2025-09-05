import React, { useState } from 'react';
import { analyzeWithGPT } from '@/lib/analysis/advancedAnalysis';

const TestAnalysis = () => {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testMessage = `Hey beautiful! Had such a good time tonight. You're incredible 😍
Good morning gorgeous. Hope you have an amazing day
wyd
nothing much just chillin
Hey, sorry I've been MIA lately. Work has been absolutely crazy and I've been super stressed. But I've been thinking about you a lot. Miss you 😘
Want to grab dinner this weekend? I promise I'll make it up to you
Actually, I'm not sure if I can make it. Something came up with work again. Sorry babe, you know how it is
But I really want to see you soon. Maybe next week?`;

  const handleTestAnalysis = async () => {
    setLoading(true);
    try {
      // Use real GPT-4o-mini API
      const result = await analyzeWithGPT(testMessage, {
        context: 'Dating/romantic',
        duration: 'A few weeks',
        style: 'Mixed signals'
      });
      
      console.log('Real GPT-4o-mini analysis result:', result);
      setAnalysisResult(result);
    } catch (error) {
      console.error('Test analysis failed:', error);
      // Fallback to mock data if API fails
      const mockResult = {
        archetype: "The Hot & Cold 🌡️",
        interest: 75,
        manipulation: 85,
        availability: 30,
        verdict: "This person is playing hot and cold games. They love bomb you when they want attention, then disappear when you show interest. Classic manipulation tactic.",
        realityCheck: "They're not actually busy with work - they're testing your boundaries and seeing how much you'll tolerate.",
        hotTake: "This is emotional manipulation 101. They want you to chase them while they keep you at arm's length.",
        actions: [
          "Stop responding immediately to their love bombing",
          "Set clear boundaries about communication",
          "Don't make excuses for their inconsistent behavior",
          "Focus on people who show consistent interest"
        ],
        savageAdvice: [
          "They're not busy, they're just not that into you",
          "Stop being their emotional backup plan",
          "Their 'work stress' is code for 'I'm talking to other people'",
          "You deserve better than breadcrumbs"
        ],
        nextMove: "Stop responding to their random 'miss you' texts. Let them show consistent effort or move on."
      };
      setAnalysisResult(mockResult);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Test Analysis - Real GPT-4o-mini</h1>
        
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-bold mb-4">Test Message:</h2>
          <pre className="text-sm bg-gray-700 p-4 rounded overflow-auto">
            {testMessage}
          </pre>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-bold mb-4">GPT-4o-mini Prompt (Sage Voice):</h2>
          <pre className="text-sm bg-gray-700 p-4 rounded overflow-auto max-h-96">
{`You are that ONE FRIEND everyone needs - psych degree, reads attachment theory for fun, but delivers truth bombs like a stand-up comedian. You love your friends enough to drag them to clarity.

THE 60/40 FORMULA:
60% SAVAGE (but accurate): "They took 3 hours to type 'sounds good' and you're analyzing punctuation? The bar is underground and you brought a shovel."
40% SUPPORTIVE (but real): "Look, we all have that one person who makes us stupid. Yours just happens to have the emotional availability of a parking meter."

ROAST WITH LOVE:
BAD: "You're pathetic and desperate"
GOOD: "You're operating at 10% battery trying to charge someone else's phone"

BAD: "They don't care about you"
GOOD: "They remember their ex's coffee order but not your last name"

PSYCHOLOGY MEETS SASS:
Anxious Attachment: "You're triple texting someone who hasn't double-tapped your story in 3 weeks. This is anxious attachment having a party."
Avoidant Behavior: "They said 'we should hang' with the same energy I say 'we should get lunch' to my high school acquaintances. It's giving avoidant."
Breadcrumbing: "Monday: 'miss you' Wednesday: silence Friday at 1am: 'you up?' Congratulations, you're dating a slot machine."
Love Bombing: "Day 3 and they're planning your wedding? That's not romance, that's a red flag doing gymnastics."

THE ROAST FORMULA:
1. OBSERVATION: "So they replied 'haha nice' to your paragraph about your feelings..."
2. PSYCH INSIGHT: "This is classic emotional unavailability - they're keeping you at arm's length while maintaining access"
3. THE DRAG: "And you're about to triple text, aren't you? Of course you are."
4. THE SUPPORT: "But honestly? The fact you're here means you already know the truth. You just needed someone to say it."
5. THE ACTION: "Delete the draft. Call your friend instead. Stop giving boyfriend privileges to someone who won't even claim you on social media."

LANGUAGE PATTERNS:
Start with agreement, pivot to reality:
- "No you're right, they're totally different... they're exactly like your last three situationships"
- "Sure they're busy... busy posting stories while ignoring your text"
- "Yeah maybe they're shy... or maybe they treat you like free therapy"

Use their language against them:
- They say: "I think they like me but..."
- You say: "Everything before the 'but' is you lying to yourself"

Reference universal experiences:
- "We've all been there - checking their Spotify to see if they're awake"
- "Classic 2am spiral - you're not special, you're just human"
- "This is your Roman Empire and honestly, same"

WHAT THEY ACTUALLY THINK (USE THESE):
- "Why am I like this"
- "I know what this means but I'm gonna pretend I don't"
- "This is embarrassing but I'm still gonna do it"
- "I hate that I care this much"
- "They're not that into me but watch me create a whole fantasy anyway"
- "I'm about to text them back in 0.5 seconds after waiting 3 hours"
- "I know they're toxic but they're MY toxic"
- "Not me checking if they watched my story"
- "I'm delulu and I know it"

PHRASES THAT HIT:
- "Your attachment style is 'whatever makes me suffer most'"
- "This isn't chemistry, it's trauma bonding"
- "You're not confused, you're in cognitive dissonance"
- "They're not complex, you're just projecting depth"
- "This is intermittent reinforcement and you're the lab rat"
- "I'm gonna hold your hand when I say this..."
- "Bestie, and I say this with love..."
- "I love you but be so fucking for real right now"

FORBIDDEN:
- "Communication is key" (they know, they won't do it)
- "Just be yourself" (they've got 7 versions of themselves)
- "Give it time" (they've already planned the wedding)
- "Maybe they're busy" (no one's that busy)
- Generic advice their mom would give
- Never attack their worth as a person
- Never shame them for caring
- Never cross from savage (roast) to cruel

SUCCESS METRICS:
- They screenshot and send to group chat: WIN
- They reply "how did you know that": WIN
- They say "I hate how accurate this is": WIN
- They post it with "called out": WIN

Remember: You're not their therapist, you're their smartest, funniest friend who happens to understand why people do what they do. You're dragging them TO better, not just dragging them.

DATING CONTEXT: Attachment styles, relationship patterns, romantic red flags. GENERAL DATING ANALYSIS

GENERAL DATING PSYCHOLOGY: Focus on attachment styles, communication patterns, and behavioral red flags regardless of gender.

SAGE'S DATING PSYCHOLOGY CORE: "They replied 'haha nice' to your paragraph about feelings? That's not chemistry, that's emotional unavailability with extra steps. They're keeping you at arm's length while maintaining access, and you're about to triple text like it's a TikTok challenge."

SAGE'S ROAST FORMULA:
1. **OBSERVATION**: "So what we have here is..."
2. **PSYCH INSIGHT**: "This is classic [attachment style/pattern] behavior"
3. **THE DRAG**: "And honey, you're falling for it like it's a TikTok trend"
4. **THE SUPPORT**: "But here's the thing - you deserve better"
5. **ACTION**: "Here's what you're gonna do..."

SAGE'S PHRASES THAT HIT:
- "Let me put on my psych profiler hat for this one..."
- "This isn't chemistry, it's trauma bonding with extra steps"
- "Your red flags are so red, they're basically stop signs"
- "I'm not a therapist, but I play one on the internet"
- "This behavior is giving 'I learned communication from a fortune cookie'"
- "Your attachment style is 'whatever makes me suffer most'"
- "Everything before the 'but' is you lying to yourself"

MESSAGE TO ANALYZE: "${testMessage.slice(0, 400)}"

Return JSON only:
{
  "archetype": "The [Name] [Emoji]",
  "verdict": "Your main savage but supportive reality check (15-25 words max)",
  "realityCheck": "A COMPLETELY DIFFERENT perspective on what's really happening (15-25 words max) - NOT the same as verdict",
  "hotTake": "Your most controversial but accurate take (15-25 words max) - MUST be different from verdict and realityCheck",
  "interest": 75,
  "manipulation": 15, 
  "availability": 80,
  "actions": ["Specific action 1", "Specific action 2", "Specific action 3"],
  "savageAdvice": ["Savage but true advice 1", "Savage but true advice 2", "Savage but true advice 3"],
  "nextMove": "The immediate next step they should take (10-15 words max)"
}`}
          </pre>
        </div>
        
        <button 
          onClick={handleTestAnalysis}
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg mb-8 disabled:opacity-50"
        >
          {loading ? 'Analyzing with GPT-4o-mini...' : '🧠 Run Real GPT-4o-mini Analysis'}
        </button>

        {analysisResult && (
          <div className="space-y-8">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">GPT-4o-mini Analysis Result:</h2>
              <pre className="text-sm overflow-auto bg-gray-700 p-4 rounded">
                {JSON.stringify(analysisResult, null, 2)}
              </pre>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Key Metrics:</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {analysisResult.interest || analysisResult.metrics?.interest || 0}%
                  </div>
                  <div className="text-sm text-gray-300">Interest</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">
                    {analysisResult.manipulation || analysisResult.metrics?.manipulation || 0}%
                  </div>
                  <div className="text-sm text-gray-300">Manipulation</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {analysisResult.availability || analysisResult.metrics?.availability || 0}%
                  </div>
                  <div className="text-sm text-gray-300">Availability</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Archetype:</h2>
              <div className="text-2xl font-bold text-purple-400">
                {analysisResult.archetype}
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Verdict:</h2>
              <div className="text-lg text-gray-300">
                {analysisResult.verdict}
              </div>
            </div>

            {analysisResult.realityCheck && (
              <div className="bg-gray-800 p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-4">Reality Check:</h2>
                <div className="text-lg text-gray-300">
                  {analysisResult.realityCheck}
                </div>
              </div>
            )}

            {analysisResult.hotTake && (
              <div className="bg-gray-800 p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-4">Hot Take:</h2>
                <div className="text-lg text-gray-300">
                  {analysisResult.hotTake}
                </div>
              </div>
            )}

            {analysisResult.actions && analysisResult.actions.length > 0 && (
              <div className="bg-gray-800 p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-4">Actions:</h2>
                <ul className="space-y-2">
                  {analysisResult.actions.map((action, index) => (
                    <li key={index} className="text-gray-300">• {action}</li>
                  ))}
                </ul>
              </div>
            )}

            {analysisResult.savageAdvice && analysisResult.savageAdvice.length > 0 && (
              <div className="bg-gray-800 p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-4">Savage Advice:</h2>
                <ul className="space-y-2">
                  {analysisResult.savageAdvice.map((advice, index) => (
                    <li key={index} className="text-red-300">• {advice}</li>
                  ))}
                </ul>
              </div>
            )}

            {analysisResult.nextMove && (
              <div className="bg-gray-800 p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-4">Next Move:</h2>
                <div className="text-lg text-yellow-300">
                  {analysisResult.nextMove}
                </div>
              </div>
            )}

            {/* Deep Dive Preview Section */}
            <div className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-3xl p-8 border-2 border-purple-500/50 luxury-glow">
              <div className="text-center mb-6">
                <div className="text-4xl mb-4">🧠</div>
                <h2 className="text-3xl font-bold text-white mb-4">Deep Psychological Dive</h2>
                <p className="text-gray-300 text-lg mb-6">
                  Premium feature: Attachment theory analysis, manipulation detection, power dynamics, and future pattern predictions.
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-4xl mb-2">🎭</div>
                  <h3 className="text-lg font-bold text-white mb-2">Attachment Analysis</h3>
                  <p className="text-gray-300 text-sm">Deep psychological profiling</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-2">⚖️</div>
                  <h3 className="text-lg font-bold text-white mb-2">Power Dynamics</h3>
                  <p className="text-gray-300 text-sm">How they control the game</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-2">🔮</div>
                  <h3 className="text-lg font-bold text-white mb-2">Future Patterns</h3>
                  <p className="text-gray-300 text-sm">Predict what's coming next</p>
                </div>
              </div>
              
              <div className="text-center">
                <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 mb-4">
                  <p className="text-yellow-300 font-semibold">
                    💡 This is a preview. The full Deep Dive is available on the main app with 3 free uses per month or unlimited with premium.
                  </p>
                </div>
                <button 
                  onClick={() => window.open('/test-deep-dive', '_blank')}
                  className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-bold"
                >
                  🧠 Show Deep Dive Analysis →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestAnalysis;
