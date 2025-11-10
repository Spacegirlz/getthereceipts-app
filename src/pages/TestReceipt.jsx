import React, { useState, useEffect } from 'react';
import ReceiptCardViral from '@/components/ReceiptCardViral';
import { analyzeWithGPT } from '@/lib/analysis/advancedAnalysis';
import { Button } from '@/components/ui/button';

const TestReceipt = () => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testMessages = [
    {
      name: "Maya & Leo (from screenshot)",
      message: `BACKGROUND: I'm Maya, 25F. This is Leo, 27M, from Bumble. We've been talking for 3 weeks; one amazing date.

TEXTS
Leo (Fri, 7:12 PM): You're literally magic. Can't stop thinking abt you ✨
Me (7:18 PM): omg stoppp lol. Same, last night was 10/10
Leo (Sat, 9:03 AM): Morning beautiful. Brunch this wknd?
Me (9:10 AM): Yess pls. Sunday?
Leo (Sun, 10:02 AM): Running late. Rain check? I owe you smth big 🌹
Me (10:05 AM): All good!
Leo (Tue, 11:58 PM): Can't sleep. Miss your face
Me (Wed, 8:14 AM): Haha you're trouble
Leo (Thu, 1:47 AM): wyd
Me (Thu, 8:36 AM): Just woke up, what's up
Leo (Thu, 8:39 AM): nvm crashed
Me (Sat, 5:21 PM): Free tmr?
 -  no reply  - 
Me (Mon, 12:02 PM): You alive?
Leo (Mon, 1:55 PM): Work tsunami. You know I adore you tho 🤍

CONTEXT: Date was fireworks. Since then it's night-texts, last-minute cancels, big compliments but no calendar.

MY GUT: Brain says "green flag words," body says "red flag actions." Feels like love-bomb → limp breadcrumb. Is he busy or keeping me in the shiny box for dopamine pings?`
    },
    {
      name: "Rules Masquerading as Care (TOXIC)",
      message: `Ava (6:02 PM): Running 10 late - tram stalled.
Miles (6:03 PM): Share live location so I know you're actually on a tram.
Ava (6:04 PM): Not doing tracking. I'll be there at 6:15.
Miles (6:05 PM): If you loved me you'd calm my anxiety instead of being difficult.
Ava (6:17 PM): I'm outside the bar.
Miles (6:28 PM): I'm not coming. Work emergency. You're overreacting anyway.
Ava (6:29 PM): You asked me to meet. I showed up.
Miles (6:31 PM): Jess says you've been distant. Even my friends notice.
Ava (6:33 PM): Jess met me twice.
Miles (11:41 PM): I'm at your door. Let me in so we can finish this.
Ava (11:42 PM): It's midnight. Not tonight.
Miles (11:43 PM): Wow. Dramatic. Delete that beach pic too - my cousin follows me.
Ava (11:44 PM): No.
Miles (11:45 PM): Silent treatment activated.
 -  Next day  - 
Ava (10:06 AM): Are we talking?
 -  no response  - 
Miles (1:12 AM): Let's reset. I brought flowers 🌹
Ava (7:34 AM): Flowers don't fix patterns.
Miles (7:36 AM): Patterns like you flirting with the bartender?
Ava (7:37 AM): I said thanks for water.
Miles (7:39 AM): Whatever. Also I left my hoodie "by accident." Keep it safe.
Ava (12:02 PM): Picked it up.
Miles (12:05 PM): I'll swing by later. Don't post anything till then; people talk.
Ava (12:07 PM): I'm not living by your PR rules.
Miles (12:10 PM): Share your location and we're fine.
Ava (12:12 PM): Boundary stands: schedule in daylight, no pop-ins.
Miles (12:13 PM): Guess you don't care.
Miles (12:15 PM): I care about respect.
Miles (12:17 PM): Enjoy being single then.
Ava (12:20 PM): If that's your choice, noted.`
    },
    {
      name: "Great Chemistry, Patchy Consistency (UP & DOWN)",
      message: `Rae (5:11 PM): You crushed your demo. Celebratory ramen Friday?
Finn (5:12 PM): Yes pls. 7pm? I'll book.
Rae (5:13 PM): Lock it.
 -  Friday  - 
Finn (4:56 PM): Client call moved. I can do 7:30 or Sat. Your call.
Rae (4:59 PM): Let's do Sat. I don't want a rushed dinner.
Finn (5:01 PM): Booked Sat 6:30. I owe you gyoza.
 -  Saturday  - 
Rae (6:18 PM): Parking now.
Finn (6:19 PM): Running 10 late - flowers + apology in hand.
Rae (6:20 PM): I like apologies that arrive on time.
Finn (6:21 PM): Fair. Setting "leave early" alarm for future me.
 -  Later  - 
Finn (9:04 PM): Tonight was so good. Brunch tomorrow?
Rae (9:06 PM): Yes, if "tomorrow" means an actual time.
Finn (9:07 PM): 10:30, Little Pearl.
 -  Sunday  - 
Rae (10:28 AM): Here.
Finn (10:36 AM): 8 mins out 🙃
Rae (10:37 AM): Pattern spotted. I'll grab a table.
Finn (10:39 AM): You're right. I keep cutting it close. I'll fix it.
 -  Midweek  - 
Finn (8:12 PM): Rooftop w/ team tonight. Heads up so Insta doesn't look "single energy."
Rae (8:14 PM): Appreciate the ping. Thirst traps allowed; mystery arms banned.
Finn (8:15 PM): Copy.
 -  Friday  - 
Rae (6:03 PM): Are we still on for movie?
Finn (6:05 PM): Totally. Already bought seats.
Rae (6:06 PM): Green flag noted.
Finn (6:08 PM): Want the caramel popcorn bribe anyway.
Rae (6:09 PM): Accepting bribes that arrive on schedule.`
    },
    {
      name: "Misread Signals → Clear Repair (HEALTHY)",
      message: `Nina (7:41 PM): Your rooftop story looked fun. My brain did a little spin.
Jae (7:42 PM): Team drinks. I should've sent a heads up - my bad.
Nina (7:44 PM): I don't want to police you. I just hate guessing.
Jae (7:45 PM): Let's do rules that aren't weird: if I'm out late, I send "home by X."
Nina (7:46 PM): Works. I'll do the same when I'm off-grid.
Jae (7:48 PM): Also I saw your DM to Eli about the zine; my lizard brain read flirty.
Nina (7:50 PM): It was layout talk, not heart talk.
Jae (7:51 PM): Cool. I'll ask next time, not spiral.
Nina (7:53 PM): Capacity check: I'm yellow tonight. Short call?
Jae (7:54 PM): Yellow too. 15-min debrief then Mario Kart ceasefire?
Nina (7:55 PM): Deal.
 -  Later  - 
Jae (9:11 PM): Also… I joked about your caption last week. It landed mean. Sorry.
Nina (9:13 PM): Thanks for naming it. I'm sensitive about that; appreciate the catch.
Jae (9:15 PM): Re: Sunday - my sis asked if you'll come to her picnic. Dog-friendly.
Nina (9:16 PM): Yes, but I'll bail at 3 to prep Monday.
Jae (9:17 PM): I'll walk you to the tram at 2:55.
Nina (9:18 PM): Phones away during picnic?
Jae (9:19 PM): DND 12–3. Hold me to it.
Nina (9:20 PM): Consider yourself held.
Jae (9:22 PM): We good?
Nina (9:23 PM): We're learning. That's good.`
    },
    {
      name: "The Breadcrumber",
      message: "This guy I'm dating is so confusing. He texts me constantly saying he misses me and wants to see me, but when I try to make plans he's always 'busy' or 'maybe next week.' He says he's not seeing anyone else but I found out he's still active on dating apps. When I confronted him he said 'I thought we were just hanging out' even though we've been intimate."
    },
    {
      name: "The Gaslighting Boss",
      message: "My boss keeps changing what they want from me. They told me to focus on project A, then when I present it they say 'we discussed focusing on project B' even though I have emails proving otherwise. They're now saying my performance is suffering because I'm not delivering what was agreed, but they keep moving the goalposts. Yesterday they said 'your memory seems to be an issue' when I brought up their original instructions."
    },
    {
      name: "The Energy Vampire Friend",
      message: "My friend only reaches out when they need something. They'll ignore my texts for weeks, then suddenly want to 'catch up' but really they need help moving or want to borrow money. When I say no, they guilt trip me about how 'friends help each other' and remind me of that one time they helped me with something years ago."
    }
  ];

  const runTest = async (testMessage) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Testing with message:', testMessage.message);
      const result = await analyzeWithGPT(testMessage.message, {
        isShareShot: true,
        context: 'Dating/Romantic'
      });
      
      console.log('Analysis result:', result);
      setAnalysis(result);
    } catch (err) {
      console.error('Test error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Test with hardcoded data
  const testHardcoded = () => {
    const testData = {
      archetype: "The Breadcrumber 🍞",
      verdict: "Bestie, they're keeping you on the hook with minimal effort. Classic breadcrumber behavior showing exactly zero follow-through.",
      realityCheck: "You're not confused, they're confusing. There's a difference between mixed signals and consistently showing you they don't care.",
      hotTake: "This isn't chemistry, it's intermittent reinforcement and you're the lab rat pressing the lever for random treats.",
      silverLining: "You're learning to spot red flags early - that's real growth.",
      interest: 75,
      manipulation: 85,
      availability: 15,
      metrics: {
        interest: 75,
        manipulation: 85,
        availability: 15
      },
      actions: [
        "Stop initiating contact and watch how fast they disappear",
        "Block them on dating apps - they're window shopping while keeping you",
        "Find someone who makes actual plans instead of vague promises"
      ],
      confidenceScore: 92,
      tagline: "75% interest • 85% manipulation • 15% available"
    };
    
    console.log('Testing with hardcoded data:', testData);
    setAnalysis(testData);
  };

  // Test PURE prompt without any hardcoded data
  const testPurePrompt = async (testMessage) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔍 PURE PROMPT TEST - Testing with message:', testMessage.message);
      const result = await analyzeWithGPT(testMessage.message, {
        isShareShot: true,
        context: 'Dating/Romantic',
        purePropmt: true // Flag to bypass hardcoded overrides
      });
      
      console.log('🔍 PURE PROMPT - Analysis result:', result);
      setAnalysis(result);
    } catch (err) {
      console.error('Pure prompt test error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Receipt Test Page</h1>
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-8">
          <h2 className="text-red-300 font-bold mb-2">🚨 DEBUG ISSUE IDENTIFIED:</h2>
          <p className="text-red-200">Found a voiceOverride system in advancedAnalysis.js that forces "Absolutely pathetic" endings. This overrides our comprehensive prompt.</p>
        </div>
        
        <div className="mb-8 space-y-4">
          <div className="space-y-4">
            <div className="flex gap-4 flex-wrap">
              {testMessages.map((test, index) => (
                <Button
                  key={index}
                  onClick={() => runTest(test)}
                  disabled={loading}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Test: {test.name}
                </Button>
              ))}
              <Button
                onClick={testHardcoded}
                className="bg-green-600 hover:bg-green-700"
              >
                Test with Hardcoded Data
              </Button>
            </div>
            
            <div className="border-t border-gray-600 pt-4">
              <h3 className="text-lg font-bold text-cyan-300 mb-3">🔍 PURE PROMPT TESTS (No Hardcoded Overrides)</h3>
              <div className="flex gap-4 flex-wrap">
                {testMessages.map((test, index) => (
                  <Button
                    key={`pure-${index}`}
                    onClick={() => testPurePrompt(test)}
                    disabled={loading}
                    className="bg-cyan-600 hover:bg-cyan-700"
                  >
                    Pure: {test.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          
          {loading && <p>Loading analysis...</p>}
          {error && <p className="text-red-500">Error: {error}</p>}
        </div>

        {analysis && (
          <div className="space-y-8">
            <div className="bg-gray-800 p-4 rounded-lg">
              <h2 className="text-xl font-bold mb-2">Raw Analysis Data:</h2>
              <pre className="text-xs overflow-auto">
                {JSON.stringify(analysis, null, 2)}
              </pre>
            </div>
            
            <div>
              <h2 className="text-xl font-bold mb-4">Receipt Card Preview:</h2>
              <ReceiptCardViral results={analysis} />
            </div>
            
            <div className="bg-gray-800 p-4 rounded-lg">
              <h2 className="text-xl font-bold mb-2">Console Output:</h2>
              <p className="text-sm text-gray-400">Check browser console for detailed debugging output</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestReceipt;