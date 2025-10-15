import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageSquare, Zap, TrendingUp, Gift, ArrowRight, Sparkles, ChevronDown, ShieldCheck, Eye, Star, Users, Clock, Trophy, Check, Crown, Rocket, Lock } from 'lucide-react';
import { useAuthModal } from '@/contexts/AuthModalContext';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import sagePurpleSwirl from '@/assets/sage-purple-swirl-circle.png';
import sageReceiptPage from '@/assets/sage-receipt-page.png';
import { injectMovingGradientStyles } from '@/utils/gradientUtils';

const LandingPage = () => {
  // Inject moving gradient styles
  React.useEffect(() => {
    injectMovingGradientStyles();
  }, []);
  
  // Scroll to top on page load to ensure consistent landing position
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const navigate = useNavigate();
  const { openModal } = useAuthModal();
  const { user, loading } = useAuth();
  const [searchParams] = useSearchParams();
  
  // 🎯 CRITICAL FIX: Capture referral codes from URL
  useEffect(() => {
    const referralCode = searchParams.get('ref');
    if (referralCode) {
      console.log('🎯 LandingPage: Referral code detected:', referralCode);
      // Store referral code in localStorage for later processing
      localStorage.setItem('pendingReferralCode', referralCode);
      // Show a subtle notification that referral was captured
      console.log('✅ Referral code saved for processing after signup');
    }
  }, [searchParams]);

  // 🔒 CRITICAL FIX: Redirect authenticated users to dashboard
  useEffect(() => {
    if (!loading && user) {
      console.log('🔒 LandingPage: User is authenticated, redirecting to dashboard:', user.email);
      // Add a small delay to prevent hydration issues
      const redirectTimer = setTimeout(() => {
        navigate('/dashboard');
      }, 100);
      return () => clearTimeout(redirectTimer);
    }
  }, [user, loading, navigate]);

  // ALL HOOKS MUST BE CALLED BEFORE ANY EARLY RETURNS
  const [liveUserCount, setLiveUserCount] = useState(1100);
  const [selectedDemo, setSelectedDemo] = useState('breadcrumb');
  const [demoResult, setDemoResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzedBefore, setHasAnalyzedBefore] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [spotsLeft, setSpotsLeft] = useState(73); // Dynamic spots counter
  const [isChanging, setIsChanging] = useState(false); // Track when counter is changing
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, 100]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);

  // Typing animation state
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeCategory, setActiveCategory] = useState('breadcrumber');

  // Category data for different receipt types
  const categoryData = {
    breadcrumber: {
      title: '2AM Breadcrumber',
      emoji: '🌙💔',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-600/20 to-pink-600/20',
      borderColor: 'border-purple-400/30',
      intoYou: '15%',
      wastingTime: '85%',
      redFlags: '4',
      receipts: [
        { src: '/receipts/breadcrumber-1.png', alt: '2AM Breadcrumber Analysis - Late Night Texts' },
        { src: '/receipts/breadcrumber-2.png', alt: '2AM Breadcrumber Analysis - Vague Questions' }
      ]
    },
    adult: {
      title: 'Actual Adult',
      emoji: '✅',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-600/20 to-emerald-600/20',
      borderColor: 'border-green-400/30',
      intoYou: '85%',
      wastingTime: '15%',
      redFlags: '0',
      receipts: [
        { src: '/receipts/adult-1.png', alt: 'Actual Adult Analysis - Consistent Communication' },
        { src: '/receipts/adult-2.png', alt: 'Actual Adult Analysis - Real Plans' }
      ]
    },
    gaslighter: {
      title: 'The Gaslighter',
      emoji: '🎭',
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-600/20 to-red-600/20',
      borderColor: 'border-orange-400/30',
      intoYou: '25%',
      wastingTime: '75%',
      redFlags: '6',
      receipts: [
        { src: '/receipts/gaslighter-1.png', alt: 'Gaslighter Analysis - Manipulation Tactics' },
        { src: '/receipts/gaslighter-2.png', alt: 'Gaslighter Analysis - Reality Distortion' }
      ]
    }
  };

  // Messages to cycle through - Gen Z nightmare scenarios
  const messages = [
    { text: '💬 "watches my story instantly but takes 8 hours to reply... lol"', color: 'bg-gradient-to-r from-blue-400 to-indigo-500', archetype: '📱👻 The WiFi Ghoster' },
    { text: '💬 "soft-launched me on close friends then hard-launched his ex 🤡"', color: 'bg-gradient-to-r from-indigo-400 to-purple-500', archetype: '📸🤡 The Backup Plan' },
    { text: '💬 "bro really typed \'wyd\' at 1:47am thinking that\'s flirting! how am i not confused."', color: 'bg-gradient-to-r from-purple-400 to-violet-500', archetype: '🌙💔 The 2AM Breadcrumber' },
    { text: '💬 "is this normal - games 10 hours straight but can\'t call for 5 min?? WTF!"', color: 'bg-gradient-to-r from-violet-400 to-pink-500', archetype: '🎮⚰️ The AFKer' },
    { text: '💬 "he said \'I love you\' on date 2 and wants to meet my parents... help 😭"', color: 'bg-gradient-to-r from-pink-400 to-rose-500', archetype: '💣💕 The Love Bomber' },
    { text: '💬 "date 1: life story trauma dump. date 2: complete ghost. make it make sense"', color: 'bg-gradient-to-r from-rose-400 to-pink-500', archetype: '💣👻 The Emotional Hit & Run' },
    { text: '💬 "u plan trips we\'ll never take but can\'t plan dinner.. I don\'t get it."', color: 'bg-gradient-to-r from-blue-400 to-purple-500', archetype: '✈️🎭 The Dream Seller' }
  ];

  // Typing animation effect
  useEffect(() => {
    const currentMessage = messages[currentMessageIndex];
    let charIndex = 0;
    setCurrentText('');
    setIsTyping(true);

    const typingInterval = setInterval(() => {
      if (charIndex < currentMessage.text.length) {
        setCurrentText(currentMessage.text.slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
        
        // Show archetype after typing completes
        setTimeout(() => {
          // Move to next message
          setTimeout(() => {
            setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
          }, 2000);
        }, 1500);
      }
    }, 50);

    return () => clearInterval(typingInterval);
  }, [currentMessageIndex]);

  // Live user count effect
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveUserCount((prev) => {
        const change = Math.random() > 0.5 ? Math.floor(Math.random() * 3) + 1 : -Math.floor(Math.random() * 2) - 1;
        const newCount = prev + change;
        return Math.max(947, Math.min(1249, newCount));
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Show loading while checking authentication - MUST BE AFTER ALL HOOKS
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  const handleGetStarted = () => navigate('/chat-input');
  const handleGoPremium = () => navigate('/pricing');
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  
  const handleCheckout = async (priceId, tierName) => {
    if (!user) {
      openModal('sign_up');
      return;
    }
    navigate('/pricing');
  };

  const demoData = {
    breadcrumb: {
      title: '💔 The 2am "Hey"',
      question: 'Maya asks: Why is my ex texting me at 2am?',
      conversation: [
        { sender: 'Dylan', text: 'Hey', type: 'dylan', time: 'Friday 2:47 AM' },
        { sender: 'Dylan', text: 'I know it\'s late', type: 'dylan', time: 'Friday 2:47 AM' },
        { sender: 'Dylan', text: 'Was just thinking about that beach trip we did last summer', type: 'dylan', time: 'Friday 2:51 AM' },
        { sender: 'Maya', text: 'Why are you texting me?', type: 'maya', time: 'Friday 9:15 AM' },
        { sender: 'Dylan', text: 'I\'ve been in therapy and realized I really messed things up with us\nNot trying to start anything, just wanted you to know', type: 'dylan', time: 'Friday 9:23 AM' },
        { sender: 'Dylan', text: 'How have you been though?\nSeeing anyone?', type: 'dylan', time: 'Friday 9:31 AM' }
      ],
      result: {
        pattern: 'The 2am Breadcrumber',
        verdict: 'Bestie, he went from 0 to "therapy breakthrough" in 3.5 messages!',
        intoYou: '18%',
        wastingTime: '92%',
        redFlags: '9',
        tea: 'That 2am "hey" is literally his Plan Z falling through. He got rejected, drank, scrolled too far, and landed on you. The therapy name-drop? Classic "I\'ve changed" without changing. You\'re not his redemption arc, you\'re his backup plan.',
        prophecy: 'Watch: He\'ll suggest "coffee to catch up" within 48 hours. Then trauma dump about his recent ex while fishing for sympathy. Block now or suffer later.',
        playbook: 'Don\'t respond (silence is self-care)\nBlock if you\'re weak to nostalgia\nScreenshot for the group chat\nRemember why you left',
        confidence: '95%',
        confidenceText: 'RECYCLING CENTER IS CLOSED, BESTIE'
      }
    },
    lovebomb: {
      title: '📅 Future Faker Energy',
      question: 'Mike asks: Why does she keep canceling on me?',
      conversation: [
        { sender: 'Mike', text: 'Still on for dinner this weekend?', type: 'mike', time: 'Thursday 6:32 PM' },
        { sender: 'Jessica', text: 'Yes! Can\'t wait babe\nLet me check with the girls and get back to you', type: 'jessica', time: 'Thursday 10:47 PM' },
        { sender: 'Mike', text: 'Hey! Just checking what day works?', type: 'mike', time: 'Saturday 2:15 PM' },
        { sender: 'Jessica', text: 'Sorry crazy week. Rain check?\nWe should do that trip we talked about soon though', type: 'jessica', time: 'Sunday 11:31 AM' },
        { sender: 'Jessica', text: 'Miss you ❤️', type: 'jessica', time: 'Sunday 11:32 AM' },
        { sender: 'Mike', text: 'Did you figure out your schedule?', type: 'mike', time: 'Wednesday 7:45 PM' }
      ],
      result: {
        pattern: 'The Schedule Phantom',
        verdict: 'She\'s been "checking with the girls" since the Renaissance',
        intoYou: '26%',
        wastingTime: '92%',
        redFlags: '8',
        tea: 'Mike, she\'s been "checking her schedule" longer than it takes to get a passport renewed. You\'re not busy, you\'re not important to her. You\'re her Tuesday when everyone else is busy. That heart emoji? Maintenance mode to keep you as backup while she explores other options.',
        prophecy: 'Next week: another vague excuse with "soon" or "maybe." She\'ll keep you warm but never hot. In a month you\'ll still be having this same conversation.',
        playbook: 'Stop asking (you\'re embarrassing yourself)\nMatch her energy (which is zero)\nGet back on the apps tonight\nFind someone who knows what day it is',
        confidence: '97%',
        confidenceText: 'SHE\'S JUST NOT THAT INTO YOU, KING'
      }
    },
    gaslighter: {
      title: '💚 Green Flag Panic',
      question: 'Ava asks: Is this too good to be true?',
      conversation: [
        { sender: 'Marcus', text: 'Hey! Noticed you switched from your usual today. The oat vanilla is actually my secret fave too - everything okay?', type: 'marcus', time: 'Tuesday 8:47 AM' },
        { sender: 'Ava', text: 'Yeah just wanted to try something new haha', type: 'ava', time: 'Tuesday 11:23 AM' },
        { sender: 'Marcus', text: 'I make mine with an extra shot and brown sugar instead of regular\nWant me to make you one tomorrow?\nOn me :)', type: 'marcus', time: 'Tuesday 11:31 AM' },
        { sender: 'Ava', text: 'That\'s so sweet! Yes please', type: 'ava', time: 'Tuesday 11:45 AM' },
        { sender: 'Marcus', text: 'Perfect! Also random but there\'s this bookstore pop-up Saturday at 2?\nCould grab coffee first (not at my work lol I need a break)', type: 'marcus', time: 'Tuesday 11:52 AM' },
        { sender: 'Ava', text: 'omg yes I love those!', type: 'ava', time: 'Tuesday 12:15 PM' }
      ],
      result: {
        pattern: 'The Real Deal™',
        verdict: 'A calendar app and they actually use it. Suspiciously mature.',
        intoYou: '91%',
        wastingTime: '8%',
        redFlags: '9',
        tea: 'STOP THE PRESSES. Marcus has executive function AND remembers your coffee order. He suggested a SPECIFIC TIME and PLACE. This is rarer than finding a parking spot at Trader Joe\'s. Your toxic ex could never. Stop overthinking before you fumble this unicorn.',
        prophecy: 'He\'ll text Friday to confirm. You\'ll panic-spiral to three friends about what to wear. He\'ll show up 5 minutes early with your exact coffee order memorized. You\'ll try to find red flags that don\'t exist.',
        playbook: 'Say YES without playing games\nWear the outfit that makes you feel great\nDon\'t self-sabotage with fake plans\nLet yourself be chosen for once',
        confidence: '94%',
        confidenceText: 'THIS ONE\'S ACTUALLY DECENT, YOU\'VE GOT THIS!'
      }
    },
    family: {
      title: '🦃 Family Comparison',
      question: 'Emma asks: Why does my mom always compare me to my sister?',
      conversation: [
        { sender: 'Mom', text: 'So excited everyone\'s coming!\nWhat are you bringing sweetie?', type: 'mom', time: 'Monday 10:32 AM' },
        { sender: 'Emma', text: 'I can make my mac and cheese!', type: 'emma', time: 'Monday 10:45 AM' },
        { sender: 'Mom', text: 'That\'s sweet but we have SO much food already. Maybe just a salad?\nSarah\'s bringing her famous stuffing', type: 'mom', time: 'Monday 10:47 AM' },
        { sender: 'Mom', text: 'BTW are you bringing someone?\nSarah\'s bringing her fiancé David', type: 'mom', time: 'Monday 10:51 AM' },
        { sender: 'Emma', text: 'No, just me', type: 'emma', time: 'Monday 11:15 AM' },
        { sender: 'Mom', text: 'That\'s okay honey! You\'re focusing on your career 😊\nSarah got promoted to VP at 26!\nSo inspiring!', type: 'mom', time: 'Monday 11:18 AM' }
      ],
      result: {
        pattern: 'The Comparison Carol',
        verdict: 'Everything\'s a competition you didn\'t sign up for',
        intoYou: '72%',
        wastingTime: '16%',
        redFlags: '7',
        tea: 'Babe, your mom loves you but she\'s got Sarah on a pedestal so high it needs air traffic control. That "focusing on your career" line with the smiley? That\'s mom-speak for "I\'m worried but making it your fault." You\'re not behind schedule - you\'re on YOUR schedule. And your mac and cheese is probably fire.',
        prophecy: 'She\'ll ask about dating 3 times. Sarah\'s engagement will come up 7 times. You\'ll feel small for exactly 2.5 hours. Then you\'ll remember you\'re doing amazing and she just can\'t see it yet.',
        playbook: 'Bring the mac and cheese anyway (it\'s better than salad)\n"Good for Sarah" + subject change\nBathroom breaks = mini meditations\nYou\'re not in competition with anyone',
        confidence: '84%',
        confidenceText: 'PSYCHIC DAMAGE FACTOR'
      }
    },
    boss: {
      title: '🤡 Boss Gaslighting',
      question: 'Tom asks: Is my manager trying to gaslight me?',
      conversation: [
        { sender: 'Rachel', text: 'Hey! Quick question about the presentation', type: 'rachel', time: 'Today 3:45 PM' },
        { sender: 'Tom', text: 'Sure, what\'s up?', type: 'tom', time: 'Today 3:47 PM' },
        { sender: 'Rachel', text: 'I thought we agreed on a different approach? I specifically remember saying keep it high-level', type: 'rachel', time: 'Today 3:52 PM' },
        { sender: 'Tom', text: 'Monday\'s meeting we decided on the data-driven format?\nI have the notes', type: 'tom', time: 'Today 3:55 PM' },
        { sender: 'Rachel', text: 'Hmm I don\'t recall that but let\'s not get stuck on it 😊 Client loved it!\nJust wish we\'d aligned better beforehand', type: 'rachel', time: 'Today 4:03 PM' },
        { sender: 'Rachel', text: 'Next time let\'s make sure everyone\'s on the same page before you run with something', type: 'rachel', time: 'Today 4:04 PM' }
      ],
      result: {
        pattern: 'The History Rewriter',
        verdict: 'Makes you doubt documented reality with a smile',
        intoYou: '0%',
        wastingTime: '11%',
        redFlags: '10',
        tea: 'Oh HELL no. She "doesn\'t recall" the meeting YOU HAVE NOTES FROM? Then hits you with "let\'s not get stuck on it" while literally getting stuck on it? That\'s not confusion, that\'s CONFUSION™️ - the corporate gaslighting special where they scramble your brain then blame you for the eggs. That passive-aggressive "wish we\'d aligned" when YOU LITERALLY ALIGNED? I\'m getting secondhand whiplash from these mental gymnastics.',
        prophecy: 'She\'ll tell this story at happy hour as "that time Tom went rogue" while you have a whole Google Doc proving otherwise. Your next good idea will mysteriously become "Rachel\'s initiative" by Q3.',
        playbook: 'Email summaries after EVERY conversation\n"Per our discussion on [DATE]" is your new bestie\nBCC yourself on everything (yes, everything)\nYou\'re not crazy, she\'s just creative with reality',
        confidence: '96%',
        confidenceText: 'THE MATH AIN\'T MATHING BUT YOUR NOTES ARE NOTING'
      }
    },
    toogood: {
      title: '💕 Too Good to Be True?',
      question: 'Alex asks: Is Jordan actually this perfect?',
      conversation: [
        { sender: 'Alex', text: 'Hey! Running 5 min late from work\nTraffic is brutal on the 405', type: 'alex', time: 'Monday 7:15 PM' },
        { sender: 'Jordan', text: 'No worries! Just grabbed us a table. Take your time', type: 'jordan', time: 'Monday 7:18 PM' },
        { sender: 'Alex', text: 'You\'re the best. Also my mom wants to know if you like lasagna for Sunday dinner 😅', type: 'alex', time: 'Monday 7:19 PM' },
        { sender: 'Jordan', text: 'Tell her I love it! Should I bring dessert? Wine?', type: 'jordan', time: 'Monday 7:23 PM' },
        { sender: 'Alex', text: 'She said just yourself but knowing you, you\'ll bring both anyway', type: 'alex', time: 'Monday 7:25 PM' },
        { sender: 'Jordan', text: 'You know me too well 😊\nDrive safe, see you soon', type: 'jordan', time: 'Monday 7:27 PM' }
      ],
      result: {
        pattern: 'The Actual Adult™',
        verdict: 'They respond in real-time and make plans that actually happen',
        intoYou: '94%',
        wastingTime: '3%',
        redFlags: '10',
        tea: 'Bestie, I\'ve analyzed this 47 times looking for the catch and... there isn\'t one? They\'re communicating about being late BEFORE they\'re late? Meeting your mom WITHOUT having a breakdown? The math is actually mathing for once. Stop waiting for the plot twist - sometimes people are just emotionally available and have their life together. Wild concept, I know.',
        prophecy: 'They\'ll bring both wine AND dessert. Your mom will love them. You\'ll panic that it\'s "too easy" and create problems that don\'t exist. Stop it.',
        playbook: 'Accept that healthy feels boring at first\nStop looking for red flags in green gardens\nLet yourself be happy (revolutionary, I know)\nMaybe delete your ex\'s number finally?',
        confidence: '92%',
        confidenceText: 'SOMETIMES GOOD THINGS JUST HAPPEN, BABE'
      }
    },
    ghost2019: {
      title: '👻 The Ghost from 2019',
      question: 'Sam asks: Why is my ex from 5 years ago texting me?',
      conversation: [
        { sender: 'Chase', text: 'Sam??? Is this still your number?', type: 'chase', time: 'Tuesday 11:47 PM' },
        { sender: 'Chase', text: 'Just saw someone who looked exactly like you at Whole Foods', type: 'chase', time: 'Tuesday 11:48 PM' },
        { sender: 'Sam', text: 'Chase? Why are you texting me?', type: 'sam', time: 'Wednesday 8:32 AM' },
        { sender: 'Chase', text: 'I know it\'s been forever but I was cleaning out my phone and saw our old pics... we were good together', type: 'chase', time: 'Wednesday 9:15 AM' },
        { sender: 'Chase', text: 'You still in marketing? Still have that anxiety thing about elevators? lol', type: 'chase', time: 'Wednesday 9:16 AM' },
        { sender: 'Sam', text: 'It\'s been 5 years dude', type: 'sam', time: 'Wednesday 12:45 PM' }
      ],
      result: {
        pattern: 'The Time Traveler',
        verdict: 'Still living in 2019 while you\'re in 2024',
        intoYou: '11%',
        wastingTime: '98%',
        redFlags: '8',
        tea: 'THE GHOST FROM 2019 HAS ENTERED THE CHAT. He\'s "cleaning out his phone" but somehow your number survived 5 years and 3 iPhone upgrades? Sure, Jan. That elevator anxiety callback? He\'s trying to use outdated software to hack into your current operating system. This isn\'t nostalgia, it\'s a recession - his dating market crashed and he\'s checking old investments.',
        prophecy: 'He\'ll mention "catching up over coffee" next. Then reveal he\'s "between jobs" or "going through something." Your 2019 trauma will text you "miss us" at 1 AM next Thursday.',
        playbook: 'You\'re not the same person from 2019\nBlock or prepare for monthly "remember when" texts\nThat chapter ended for a reason\nYour glow up doesn\'t include reruns',
        confidence: '97%',
        confidenceText: '2019 CALLED, THEY DON\'T WANT HIM BACK EITHER'
      }
    },
    realitytv: {
      title: '🏝️ Reality TV Energy',
      question: 'Bella asks: Is this chaos sustainable?',
      conversation: [
        { sender: 'Kai', text: 'Bellaaaaa did we really steal a traffic cone last night???', type: 'kai', time: 'Sunday 2:15 PM' },
        { sender: 'Bella', text: 'LMAOOO I have it in my living room 💀', type: 'bella', time: 'Sunday 2:47 PM' },
        { sender: 'Kai', text: 'NO WAYYYY\nAlso did I really challenge that guy to arm wrestle for your number?', type: 'kai', time: 'Sunday 2:48 PM' },
        { sender: 'Bella', text: 'You lost but it was iconic\nHe gave it to you anyway', type: 'bella', time: 'Sunday 2:52 PM' },
        { sender: 'Kai', text: 'Worth it tbh\nDrinks Tuesday? I promise no traffic cones this time', type: 'kai', time: 'Sunday 2:54 PM' },
        { sender: 'Bella', text: 'You can\'t promise that and we both know it 😂', type: 'bella', time: 'Sunday 3:01 PM' }
      ],
      result: {
        pattern: 'The Hot Mess Express',
        verdict: 'Chaotic energy but at least they own it',
        intoYou: '73%',
        wastingTime: '95%',
        redFlags: '6',
        tea: 'This is giving Love Island meets Jackass meets someone\'s cousin\'s wedding energy and honestly? Respect. They stole city property and arm wrestled a stranger for your digits? That\'s not a red flag, that\'s a whole circus tent and they\'re the ringmaster. Will this last? Absolutely not. Will you have stories? ABSOLUTELY YES. Sometimes you need a little reality TV in your real life.',
        prophecy: 'Tuesday\'s drinks will end with karaoke, a new tattoo idea, or both. You\'ll date for exactly 3 months of pure chaos. You\'ll either marry them or block them everywhere. No in between.',
        playbook: 'Hide your valuables\nKeep your friends on speed dial\nDocument everything for the group chat\nEnjoy the show while it lasts',
        confidence: '89%',
        confidenceText: 'THIS IS YOUR VILLAIN ERA AND I\'M HERE FOR IT'
      }
    }
  };

  const analyzeDemo = async (demoType) => {
    setIsAnalyzing(true);
    setDemoResult(null);
    setHasAnalyzedBefore(true);
    
    setTimeout(() => {
      setDemoResult(demoData[demoType].result);
      setIsAnalyzing(false);
    }, 1000);
  };

  const handleDemoTabChange = (key) => {
    setSelectedDemo(key);
    if (hasAnalyzedBefore) {
      // Auto-analyze the new tab since user has analyzed before
      analyzeDemo(key);
    } else {
      // Clear results if user hasn't analyzed before
      setDemoResult(null);
    }
  };

  const stats = [
    { value: '2.3M+', label: 'Hot Takes Delivered', subtext: 'Since launch' },
    { value: '94%', label: 'Say \'OMG This Is So True\'', subtext: '(Not science, just vibes)' },
    { value: '60s', label: 'To Stop Spiraling', subtext: 'Average time' }
  ];

  const testimonials = [
    {
      text: "I wish I had this years ago. Finally stopped wasting months on people who weren't serious.",
      author: "@sarah_k",
      type: "Premium user"
    },
    {
      text: "The real tea feature is *chef's kiss*. Sometimes you need someone to just tell you the truth.",
      author: "@mike_dating",
      type: "Daily user"
    },
    {
      text: "Used it on my boyfriend's sweet text just to see what happened. Sage called him 'suspiciously well-adjusted' and told me to 'stop looking for problems that don't exist.' I love her.",
      author: "@secure_attachment_sara",
      type: "Premium user"
    },
    {
      text: "Ran my ex's 'I miss us' text from 2019 through it for laughs. Sage said 'He misses the free therapy, not you.' My friends and I SCREAMED.",
      author: "@moved_on_michelle",
      type: "Founder's Club"
    }
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-violet-950 to-slate-950 text-white overflow-hidden relative">
      {/* Background Elements - Simplified to avoid conflicts */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(139,92,246,0.15),transparent)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_80%_80%,rgba(59,130,246,0.08),transparent)] pointer-events-none" />
      
      {/* Navigation is handled globally by App.jsx MainHeader */}

      {/* Hero Section */}
      <section id="home" className="relative px-6 lg:px-8 pt-32 pb-16">
        <div className="mx-auto max-w-7xl">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Live Activity Counter with Typing Animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-12"
            >
              {/* Live counter */}
              <div className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-6 py-3 mb-6">
                <div className="relative">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <div className="absolute inset-0 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                </div>
                <span className="text-sm text-emerald-300 font-medium">
                  {liveUserCount.toLocaleString()} people getting Sage's take right now
                </span>
              </div>

              {/* Typing animation */}
              <div className="h-24 flex flex-col items-center justify-center space-y-2">
                {!isTyping && currentText && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="text-base md:text-lg text-center"
                  >
                    <span className="text-teal-300 font-medium">
                      {messages[currentMessageIndex].archetype}
                    </span>
                  </motion.div>
                )}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-base md:text-lg text-center"
                >
                  <span className={`${messages[currentMessageIndex].color} bg-clip-text text-transparent tracking-wide`}>
                    {currentText}
                    {isTyping && (
                      <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                        className="inline-block ml-1"
                      >
                        |
                      </motion.span>
                    )}
                  </span>
                </motion.div>
              </div>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              id="landing_1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8"
            >
              <span className="bg-gradient-to-r from-white via-violet-200 to-blue-200 bg-clip-text text-transparent">
                Stop second-guessing
              </span>
              <br />
              <span className="moving-gradient-text">
                their texts.
              </span>
            </motion.h1>

            {/* Sub-headline */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-300 mb-6 max-w-3xl mx-auto leading-relaxed"
            >
              One weird message and your brain's in a loop.
            </motion.p>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-lg text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
            >
              Sage decodes the chat you can't stop replaying. From crushes to coworkers, breakups to besties. She doesn't read minds. She reads patterns. And she's seen it all.
            </motion.p>

            {/* Primary CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 w-full max-w-xl mx-auto px-2"
            >
              <Button
                onClick={handleGetStarted}
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-purple-700 text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-2xl shadow-violet-500/25 transition-all duration-300 hover:scale-105 hover:shadow-violet-500/40"
              >
                Get Your Free Receipts
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-white mb-8"
            >
              <div className="flex items-center space-x-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Bank-level encryption</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-yellow-400" />
                <span>Privacy First Policy</span>
              </div>
              <div className="flex items-center space-x-2">
                <Lock className="h-4 w-4 text-blue-400" />
                <span>Never stored or shared</span>
              </div>
            </motion.div>

            {/* Free Anonymous Notice */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-center text-white text-sm"
            >
              FREE Forever • No login to start • Fully anonymous.
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <motion.div 
          style={{ y: y1 }}
          className="absolute top-1/4 left-8 w-20 h-20 bg-gradient-to-br from-violet-500 to-blue-500 rounded-full opacity-20 blur-xl"
        />
        <motion.div 
          style={{ y: y2 }}
          className="absolute bottom-1/4 right-8 w-32 h-32 bg-gradient-to-br from-pink-500 to-violet-600 rounded-full opacity-20 blur-xl"
        />
      </section>

      {/* CTA directly under the demo */}
      

      {/* Meet Sage Section */}
      <section id="about" className="relative px-6 lg:px-8 pt-16 pb-32">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="grid lg:grid-cols-2 gap-16 items-center"
          >
            <motion.div variants={fadeInUp}>
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-violet-500/10 to-blue-500/10 border border-violet-500/20 rounded-full px-4 py-2 mb-6">
                <Sparkles className="h-4 w-4 text-violet-400" />
                <span className="text-sm text-violet-300 font-medium">Meet Sage</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-violet-400 via-blue-400 to-blue-500 bg-clip-text text-transparent">
                Your AI bestie with opinions
              </h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-violet-500/10 to-blue-500/10 rounded-2xl border border-violet-500/20">
                  <span className="text-2xl">🔍</span>
                  <span className="text-violet-300 font-medium">She's seen every pattern: breadcrumbing, ghosting, love bombing.</span>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-violet-500/10 to-blue-500/10 rounded-2xl border border-violet-500/20">
                  <span className="text-2xl">🤝</span>
                  <span className="text-violet-300 font-medium">Not a therapist. Not your mom. Just that friend who's had enough of your spiral.</span>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-violet-500/10 to-blue-500/10 rounded-2xl border border-violet-500/20">
                  <span className="text-2xl">🪄</span>
                  <span className="text-violet-300 font-medium">Savage takes. Zero filter. Made with love.</span>
                </div>
              </div>


              <Button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl shadow-lg transition-all duration-300 flex items-center space-x-2"
              >
                <span>Try it free →</span>
                <span className="text-lg">🪄</span>
              </Button>
            </motion.div>

            <motion.div 
              variants={fadeInUp}
              className="relative"
            >
              <div className="relative z-10 bg-gradient-to-br from-violet-500/20 to-blue-500/20 border border-white/10 rounded-3xl p-6">
                <div className="w-full max-w-sm mx-auto aspect-square bg-gradient-to-br from-violet-400 to-blue-500 rounded-2xl flex items-center justify-center overflow-hidden">
                  <img 
                    src={sagePurpleSwirl} 
                    alt="Sage - Your AI bestie with opinions" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

      </section>


      {/* Interactive Demo Section */}
      <section id="demo" className="relative px-6 lg:px-8 py-32">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <button 
                onClick={handleGetStarted}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-violet-500/10 to-blue-500/10 border border-violet-500/20 rounded-full px-4 py-2 hover:from-violet-500/20 hover:to-blue-500/20 transition-all duration-300 cursor-pointer"
              >
                <MessageSquare className="h-4 w-4 text-violet-400" />
                <span className="text-sm text-violet-300 font-medium">
                  💌 Want your own Sage Receipt? Get One →
                </span>
              </button>
            </motion.div>
            
            <motion.h2 
              variants={fadeInUp}
              className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
            >
              What does <span className="text-white">Sage think</span> about <em className="moving-gradient-text">that chat?</em>
            </motion.h2>
            
            <motion.div variants={fadeInUp} className="space-y-4 text-lg text-gray-300 max-w-4xl mx-auto">
              <p>Sage gives her take in 60 seconds. No fluff. No false hope. Just her perspective. (For entertainment only, but somehow always hits)</p>
              <p className="text-violet-300">Your texts. Common patterns. Sage's hot takes.</p>
            </motion.div>

            {/* Demo heading */}
            <motion.h3 
              variants={fadeInUp}
              className="text-2xl md:text-3xl font-bold mt-6 mb-2 bg-gradient-to-r from-violet-400 via-blue-400 to-blue-500 bg-clip-text text-transparent"
            >
              Test the Sage Demo
            </motion.h3>

            {/* Million-Dollar Receipt Showcase */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-8"
            >
              {/* Premium Header */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-violet-500/10 to-pink-500/10 px-8 py-4 rounded-full border border-white/10 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-r from-violet-400 to-pink-400 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">👑</span>
                  </div>
                  <h4 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
                    Sage's Truth Receipts
                  </h4>
                </div>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                  See exactly what you'll get - real analysis, real insights, real results
                </p>
              </div>

              {/* Interactive Category Selector */}
              <div className="flex justify-center mb-12">
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-2 border border-white/10">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setActiveCategory('breadcrumber')}
                      className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                        activeCategory === 'breadcrumber' 
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                          : 'text-gray-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      🌙 2AM Breadcrumber
                    </button>
                    <button 
                      onClick={() => setActiveCategory('adult')}
                      className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                        activeCategory === 'adult' 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg' 
                          : 'text-gray-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      ✅ Actual Adult
                    </button>
                    <button 
                      onClick={() => setActiveCategory('gaslighter')}
                      className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                        activeCategory === 'gaslighter' 
                          ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg' 
                          : 'text-gray-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      🎭 The Gaslighter
                    </button>
                  </div>
                </div>
              </div>

              {/* Premium Receipt Gallery */}
              <div className="relative">
                {/* Desktop - Tinder-style Card Stack */}
                <div className="hidden md:block">
                  <div className="relative max-w-4xl mx-auto">
                    {/* Background Cards */}
                    <div className="absolute inset-0 flex justify-center items-center">
                      <div className="w-80 h-[32rem] bg-gradient-to-br from-slate-700/30 to-slate-800/30 rounded-3xl border border-white/5 transform rotate-2 scale-95"></div>
                      <div className="w-80 h-[32rem] bg-gradient-to-br from-slate-600/40 to-slate-700/40 rounded-3xl border border-white/10 transform -rotate-1 scale-98"></div>
                    </div>
                    
                    {/* Main Card */}
                    <div className="relative z-10 flex justify-center">
                      <motion.div
                        whileHover={{ scale: 1.02, y: -10 }}
                        className="relative w-80 h-[32rem] bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl border border-white/20 shadow-2xl overflow-hidden cursor-pointer"
                        style={{
                          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 50%, rgba(15, 23, 42, 0.95) 100%)',
                          backdropFilter: 'blur(20px)',
                          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                        }}
                      >
                        {/* Premium Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10"></div>
                        
                        {/* Receipt Image */}
                        <div className="relative h-full p-6">
                          <img
                            src={categoryData[activeCategory].receipts[0].src}
                            alt={categoryData[activeCategory].receipts[0].alt}
                            className="w-full h-full object-cover rounded-2xl shadow-xl"
                          />
                          
                          {/* Premium Overlay */}
                          <div className="absolute inset-6 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-2xl"></div>
                          
                          {/* Bottom Info Bar */}
                          <div className="absolute bottom-6 left-6 right-6">
                            <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h5 className="text-white font-bold text-lg">{categoryData[activeCategory].title}</h5>
                                  <p className="text-gray-300 text-sm">Into You: {categoryData[activeCategory].intoYou} | Wasting Time: {categoryData[activeCategory].wastingTime}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className={`w-3 h-3 rounded-full ${
                                    categoryData[activeCategory].redFlags === '0' ? 'bg-green-400' : 'bg-red-400'
                                  }`}></div>
                                  <span className={`text-sm font-semibold ${
                                    categoryData[activeCategory].redFlags === '0' ? 'text-green-400' : 'text-red-400'
                                  }`}>
                                    {categoryData[activeCategory].redFlags === '0' ? 'Green Flags' : `${categoryData[activeCategory].redFlags} Red Flags`}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Mobile - Instagram Story Style */}
                <div className="md:hidden">
                  <div className="max-w-sm mx-auto">
                    <div className="relative">
                      {/* Story-style Container */}
                      <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-2 border border-white/20 shadow-2xl">
                        <div className="relative">
                          <img
                            src={categoryData[activeCategory].receipts[0].src}
                            alt={categoryData[activeCategory].receipts[0].alt}
                            className="w-full aspect-[9/16] object-cover rounded-2xl"
                          />
                          
                          {/* Story-style Top Bar */}
                          <div className="absolute top-4 left-4 right-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 bg-gradient-to-r ${categoryData[activeCategory].color} rounded-full flex items-center justify-center`}>
                                  <span className="text-white text-lg">👑</span>
                                </div>
                                <div>
                                  <h5 className="text-white font-bold">Sage's Receipt</h5>
                                  <p className="text-gray-300 text-xs">{categoryData[activeCategory].title}</p>
                                </div>
                              </div>
                              <div className="bg-black/40 backdrop-blur-sm rounded-full px-3 py-1">
                                <span className="text-white text-sm font-semibold">{categoryData[activeCategory].intoYou}</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Story-style Bottom Bar */}
                          <div className="absolute bottom-4 left-4 right-4">
                            <div className="bg-black/40 backdrop-blur-sm rounded-xl p-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className={`w-2 h-2 rounded-full ${
                                    categoryData[activeCategory].redFlags === '0' ? 'bg-green-400' : 'bg-red-400'
                                  }`}></div>
                                  <span className={`text-sm font-semibold ${
                                    categoryData[activeCategory].redFlags === '0' ? 'text-green-400' : 'text-red-400'
                                  }`}>
                                    {categoryData[activeCategory].redFlags === '0' ? 'Green Flags' : `${categoryData[activeCategory].redFlags} Red Flags`}
                                  </span>
                                </div>
                                <div className="text-white text-sm">{categoryData[activeCategory].wastingTime} Wasting Time</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation Dots */}
                <div className="flex justify-center mt-8 gap-3">
                  <div className="w-3 h-3 bg-gradient-to-r from-violet-400 to-pink-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                  <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                </div>
              </div>

              {/* Premium Tease Section */}
              <div className="mt-12 max-w-4xl mx-auto">
                <div className="text-center mb-8">
                  <h5 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-2">
                    👑 Sage's Premium Features
                  </h5>
                  <p className="text-gray-400 text-sm">See what premium members get access to</p>
                </div>

                {/* Premium Feature Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Playbook Tease */}
                  <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl border border-yellow-400/20 p-6 overflow-hidden">
                    {/* Premium Badge */}
                    <div className="absolute top-4 right-4">
                      <div className="bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border border-yellow-400/30 rounded-full px-3 py-1">
                        <span className="text-yellow-300 text-xs font-semibold">👑 PREMIUM</span>
                      </div>
                    </div>

                    {/* Header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                        <span className="text-white text-xl">🎯</span>
                      </div>
                      <div>
                        <h6 className="text-white font-bold text-lg">Sage's Playbook</h6>
                        <p className="text-gray-400 text-sm">Your personalized action plan</p>
                      </div>
                    </div>

                    {/* Preview Content */}
                    <div className="space-y-3">
                      {/* Step 1 - Fully Visible */}
                      <div className="p-3 bg-green-500/10 border border-green-400/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-green-400 font-bold text-sm">Step 1:</span>
                          <span className="text-green-300 font-semibold text-sm">The Power Move</span>
                        </div>
                        <p className="text-white text-sm">Stop responding to their 2AM texts immediately. This breaks their pattern and forces them to engage during normal hours...</p>
                      </div>

                      {/* Step 2 - Blurred Tease */}
                      <div className="relative p-3 bg-slate-700/50 rounded-lg">
                        <div className="blur-sm">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-gray-400 font-bold text-sm">Step 2:</span>
                            <span className="text-gray-300 font-semibold text-sm">The Boundary Set</span>
                          </div>
                          <p className="text-gray-500 text-sm">When they finally text during normal hours, use this exact phrase to establish your boundaries...</p>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-lg px-3 py-1">
                            <span className="text-yellow-300 text-xs font-semibold">👑 Premium Content</span>
                          </div>
                        </div>
                      </div>

                      {/* Step 3 - Blurred Tease */}
                      <div className="relative p-3 bg-slate-700/50 rounded-lg">
                        <div className="blur-sm">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-gray-400 font-bold text-sm">Step 3:</span>
                            <span className="text-gray-300 font-semibold text-sm">The Follow-Through</span>
                          </div>
                          <p className="text-gray-500 text-sm">Maintain your position with these specific responses that show you're not playing games...</p>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-lg px-3 py-1">
                            <span className="text-yellow-300 text-xs font-semibold">👑 Premium Content</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold py-3 rounded-xl transition-all duration-300 hover:scale-105">
                        Unlock Full Playbook
                      </button>
                      <p className="text-gray-400 text-xs mt-2 text-center">$29.99/year • Join 10,000+ users</p>
                    </div>
                  </div>

                  {/* Immunity Tease */}
                  <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl border border-yellow-400/20 p-6 overflow-hidden">
                    {/* Premium Badge */}
                    <div className="absolute top-4 right-4">
                      <div className="bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border border-yellow-400/30 rounded-full px-3 py-1">
                        <span className="text-yellow-300 text-xs font-semibold">👑 PREMIUM</span>
                      </div>
                    </div>

                    {/* Header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                        <span className="text-white text-xl">🛡️</span>
                      </div>
                      <div>
                        <h6 className="text-white font-bold text-lg">Immunity Training</h6>
                        <p className="text-gray-400 text-sm">Break the cycle permanently</p>
                      </div>
                    </div>

                    {/* Preview Content */}
                    <div className="space-y-3">
                      {/* Checkpoint 1 - Fully Visible */}
                      <div className="p-3 bg-green-500/10 border border-green-400/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-green-400 font-bold text-sm">Checkpoint 1:</span>
                          <span className="text-green-300 font-semibold text-sm">Pattern Recognition</span>
                        </div>
                        <p className="text-white text-sm">Identify the exact moment they start their manipulation cycle. Look for these 3 specific triggers...</p>
                      </div>

                      {/* Checkpoint 2 - Blurred Tease */}
                      <div className="relative p-3 bg-slate-700/50 rounded-lg">
                        <div className="blur-sm">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-gray-400 font-bold text-sm">Checkpoint 2:</span>
                            <span className="text-gray-300 font-semibold text-sm">Response Training</span>
                          </div>
                          <p className="text-gray-500 text-sm">Practice these exact responses that shut down their manipulation attempts without escalating...</p>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-lg px-3 py-1">
                            <span className="text-yellow-300 text-xs font-semibold">👑 Premium Content</span>
                          </div>
                        </div>
                      </div>

                      {/* Checkpoint 3 - Blurred Tease */}
                      <div className="relative p-3 bg-slate-700/50 rounded-lg">
                        <div className="blur-sm">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-gray-400 font-bold text-sm">Checkpoint 3:</span>
                            <span className="text-gray-300 font-semibold text-sm">Protection Protocol</span>
                          </div>
                          <p className="text-gray-500 text-sm">Implement these daily practices that build permanent immunity to their tactics...</p>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-lg px-3 py-1">
                            <span className="text-yellow-300 text-xs font-semibold">👑 Premium Content</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold py-3 rounded-xl transition-all duration-300 hover:scale-105">
                        Unlock Full Training
                      </button>
                      <p className="text-gray-400 text-xs mt-2 text-center">$29.99/year • 4.9/5 stars</p>
                    </div>
                  </div>
                </div>

                {/* Social Proof */}
                <div className="text-center mt-8">
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500/10 to-pink-500/10 px-6 py-3 rounded-full border border-white/10">
                    <span className="text-violet-400">⭐</span>
                    <span className="text-gray-300 text-sm">Join 10,000+ users with premium access</span>
                    <span className="text-violet-400">⭐</span>
                  </div>
                </div>
              </div>
            </motion.div>
            
            
          </motion.div>
        </div>
      </section>

      {/* CTA above How It Works */}
      <section className="relative px-6 lg:px-8 py-6">
        <div className="mx-auto max-w-3xl text-center">
          <Button
            onClick={handleGetStarted}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-10 py-5 rounded-2xl text-xl font-extrabold shadow-2xl transition-all duration-300"
          >
            🎁 3. Get Started on your FREE Receipt (No Login Required!)
          </Button>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative px-6 lg:px-8 py-32">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="text-center mb-16"
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-violet-400 via-blue-400 to-blue-500 bg-clip-text text-transparent"
            >
              How It Works
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-gray-300 max-w-3xl mx-auto"
            >
              Four steps to clarity in 60 seconds
            </motion.p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
          >
            {[
              { icon: '📱', title: '1. PASTE', desc: 'Drop in the confusing text that\'s keeping you up' },
              { icon: '🧠', title: '2. ANALYZE', desc: 'Sage spots the patterns you\'re too close to see' },
              { icon: '🧾', title: '3. RECEIPT', desc: 'Get Sage\'s receipt with her hot take' },
              { icon: '💪', title: '4. IMMUNITY', desc: 'Learn to spot these patterns yourself' }
            ].map((step, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="text-center p-6 lg:p-8 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-3xl hover:border-violet-500/30 transition-all duration-300 min-h-[200px] flex flex-col justify-center"
              >
                <div className="text-5xl mb-6">{step.icon}</div>
                <h3 className="text-xl font-bold mb-4 text-violet-400">{step.title}</h3>
                <p className="text-gray-300 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* What You Get Section */}
      <section id="features" className="relative px-6 lg:px-8 py-32">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="text-center mb-16"
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-violet-400 via-blue-400 to-blue-500 bg-clip-text text-transparent"
            >
              What You Get
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-gray-300 mb-4"
            >
              Six powerful tools to decode any conversation
            </motion.p>
            <motion.p 
              variants={fadeInUp}
              className="text-lg text-violet-300"
            >
              From red flags to relationship patterns - everything you need to know
            </motion.p>
          </motion.div>

          {/* 6 Feature Grid */}
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              {
                icon: '🚩',
                title: 'Red Flag Detection',
                description: 'Spot breadcrumbing, gaslighting, and mixed signals you might be missing. Sage catches what your heart won\'t let you see.',
                gradient: 'from-red-500/10 to-pink-500/10',
                border: 'border-red-500/20',
                iconBg: 'bg-red-500/20'
              },
              {
                icon: '🧠',
                title: 'Behavior Patterns',
                description: 'Decode their texting style and understand what it reveals about their true intentions. Every message tells a story.',
                gradient: 'from-blue-500/10 to-cyan-500/10',
                border: 'border-blue-500/20',
                iconBg: 'bg-blue-500/20'
              },
              {
                icon: '💬',
                title: 'Ask Sage',
                description: 'Chat with your AI relationship advisor. Get context, clarity, and advice tailored to your specific situation.',
                gradient: 'from-purple-500/10 to-violet-500/10',
                border: 'border-purple-500/20',
                iconBg: 'bg-purple-500/20'
              },
              {
                icon: '📚',
                title: 'The Playbook',
                description: 'Learn how to respond to common patterns and take back control. Your strategic guide to better relationships.',
                gradient: 'from-emerald-500/10 to-teal-500/10',
                border: 'border-emerald-500/20',
                iconBg: 'bg-emerald-500/20'
              },
              {
                icon: '🛡️',
                title: 'Immunity Training',
                description: 'Build resistance to manipulation tactics and recognize them faster next time. Protect your emotional wellbeing.',
                gradient: 'from-orange-500/10 to-yellow-500/10',
                border: 'border-orange-500/20',
                iconBg: 'bg-orange-500/20'
              },
              {
                icon: '🔒',
                title: 'Privacy First',
                description: 'We don\'t store your receipts. What happens here, stays here. Your secrets are safe with us.',
                gradient: 'from-slate-500/10 to-gray-500/10',
                border: 'border-slate-500/20',
                iconBg: 'bg-slate-500/20'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className={`group relative bg-gradient-to-br ${feature.gradient} backdrop-blur-sm border ${feature.border} rounded-2xl p-6 hover:shadow-2xl hover:shadow-violet-500/10 transition-all duration-300 hover:-translate-y-1`}
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 ${feature.iconBg} rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-2xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-violet-300 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>

      {/* Social Proof Section */}
      <section id="testimonials" className="relative px-6 lg:px-8 py-40">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="text-center mb-16"
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold mb-10 bg-gradient-to-r from-violet-400 via-blue-400 to-blue-500 bg-clip-text text-transparent leading-relaxed"
            >
              Join 100K+ People Getting Real Answers
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-gray-300 max-w-4xl mx-auto"
            >
              Stop living in the "what if" zone. Our community gets the clarity they need to make confident decisions.
            </motion.p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="text-center p-8 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-3xl"
              >
                <div className="text-4xl md:text-5xl font-bold text-violet-400 mb-2">{stat.value}</div>
                <div className="text-lg font-semibold text-white mb-1">{stat.label}</div>
                <div className="text-sm text-gray-400">{stat.subtext}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Testimonials */}
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="p-8 bg-gradient-to-br from-violet-500/10 to-blue-500/10 border border-violet-500/20 rounded-3xl"
              >
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4 text-lg leading-relaxed">"{testimonial.text}"</p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-400 to-blue-500 rounded-full flex items-center justify-center text-sm font-bold">
                    {testimonial.author.charAt(1).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{testimonial.author}</div>
                    <div className="text-sm text-violet-300">{testimonial.type}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="relative px-6 lg:px-8 py-32">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="text-center mb-16"
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-violet-400 via-blue-400 to-blue-500 bg-clip-text text-transparent"
            >
              FAQ
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-xl"
              style={{ color: '#c5b4e4' }}
            >
              The questions everyone asks (but is afraid to admit)
            </motion.p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="space-y-4"
          >
            {[
              {
                q: "Can I try Sage without signing up?",
                a: "Yep. No account. No strings.\nYou get 1 free Sage Receipt, no login, no credit card, no judgment.\nJust paste your chat and go.\n\nWant more? Join the Free Plan.\nYou'll get 3 bonus Receipts right away, plus 1 full Sage read every day.\nThat's the archetype, verdict, and playbook on us.\nStill no card. Still no pressure."
              },
              {
                q: "What do I get with the free plan?",
                a: "Sign up = 3 free Receipts, no expiry.\nPlus? You get 1 fresh Sage Receipt every day, no matter what.\nThat's a full decode:\n\n🔍 The read.\n🧠 The archetype.\n🧾 The receipt.\n🧭 The playbook.\n\nAll free. No card needed.\nIf it's 2:00am and your brain won't quit, Sage is here.\nYou'll get another one tomorrow."
              },
              {
                q: "Is this actual advice or just for fun?",
                a: "Sage is an AI character created for entertainment.\n\nShe's that friend who sees patterns and has opinions, lots of them.\n\nWhile users say her takes are eerily accurate (94% relate hard), she's not a therapist, counselor, or mind reader.\n\nThink of her like your horoscope. Somehow always relevant, technically entertainment, but you'll screenshot it anyway when it hits different."
              },
              {
                q: "Why does Sage sound so sure when it's just for entertainment?",
                a: "That's her character, the friend who's SO done watching you spiral that everything sounds like fact.\n\nIt's not. She's an AI with opinions, not a mind reader.\n\nBut that confidence? That's what your overthinking brain needs to hear sometimes.\n\nTake what resonates, leave what doesn't."
              },
              {
                q: "Does Sage only work on toxic situations?",
                a: "Hell no. Sage reads EVERYTHING.\n\nBring your healthy relationship and she'll validate why it's working.\nBring your ex from 2009 for laughs.\nBring your mom's guilt trip texts.\nBring that Love Island chat you're obsessed with.\n\nSage has takes on all of it, the good, the bad, and the 'what even is this?'\n\nShe's not just for crisis mode. She's for anyone who wants another perspective (or just wants to see what happens)."
              },
              {
                q: "Why is Privacy First such a big deal here?",
                a: "Because when you're pasting your real, messy convos into an app, you deserve to feel safe doing it.\n\nFrom day one, we built Get The Receipts to protect your privacy like it's our own.\n\nThat means:\n• No chat logs\n• No training on your data\n• No digging into your history\n\nYou're not here to hand over secrets, you're here to get clarity, without judgment or surveillance.\n\nAnd that's what we deliver. Every time."
              },
              {
                q: "Data: What do you keep, and what do you delete?",
                a: "We keep only what's needed to run your account and instantly delete everything else.\n\nWhat we keep:\n• Email (for login)\n• Encrypted password\n• Payment info (if you're on a paid plan)\n\nWhat we delete:\n• All receipts and messages after Sage's read (gone in 3 seconds)\n• Your receipt results (we don't store them)\n• Any record of what you pasted in\n\nWhat we never track:\n• Your behavior, message history, or usage patterns\n• Your conversations for training, marketing, or \"improvement\"\n• Any content unless you choose to save it\n\nWe use zero-storage architecture + real-time processing with contractual no-training AI services. Your data never gets used to \"make the AI better\" because Sage doesn't learn from you. She just helps you learn from your own patterns.\n\nYou stay in full control always."
              }
            ].map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className={`group border rounded-xl overflow-hidden transition-all duration-300 ${
                    isOpen 
                      ? 'border-violet-500/40 bg-violet-500/5' 
                      : 'border-gray-800/50 hover:border-gray-700/70'
                  }`}
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className={`w-full p-6 text-left flex items-center justify-between transition-all duration-200 ${
                      isOpen 
                        ? 'bg-violet-500/10' 
                        : 'hover:bg-gray-900/30'
                    }`}
                  >
                    <h3 className={`text-lg font-semibold pr-6 transition-colors ${
                      isOpen 
                        ? 'text-violet-300' 
                        : 'text-gray-200 group-hover:text-white'
                    }`}>{faq.q}</h3>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                      isOpen 
                        ? 'bg-violet-500/30 text-violet-300' 
                        : 'bg-gray-800/50 text-gray-400 group-hover:bg-gray-700/50 group-hover:text-gray-300'
                    }`}>
                      <ChevronDown 
                        className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                      />
                    </div>
                  </button>
                  <motion.div
                    initial={false}
                    animate={{
                      height: isOpen ? 'auto' : 0,
                      opacity: isOpen ? 1 : 0
                    }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-2 bg-violet-500/5">
                      <div className="border-l-2 border-violet-400/50 pl-4">
                        <p className="text-gray-200 leading-relaxed whitespace-pre-line text-base">{faq.a}</p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="text-center mb-16"
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-400 via-blue-400 to-blue-500 bg-clip-text text-transparent mb-2 md:mb-6"
              style={{ lineHeight: '1.2' }}
            >
              Simple pricing for Sage's hot takes
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-gray-300"
            >
              Start free. Upgrade when you need more clarity.
            </motion.p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Free Plans Stack - Left Column */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-col gap-4"
            >
              {/* Free Anonymous */}
              <div className="p-4 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl flex flex-col">
                <h3 className="text-lg font-bold text-white mb-2">Free No Login Required!</h3>
                <div className="text-2xl font-bold text-emerald-400 mb-2">$0<span className="text-sm text-gray-400">/month</span></div>
                <p className="text-gray-400 mb-3 text-xs">Perfect for occasional perspective</p>
                <ul className="space-y-1 mb-4 flex-grow">
                  {[
                    '3 receipts (lifetime)',
                    '3 Sage chats per receipt',
                    'Full read & insights',
                    'Shareable receipt cards'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <Check className="h-3 w-3 text-emerald-400" />
                      <span className="text-gray-300 text-xs">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={handleGetStarted}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-2 rounded-lg text-xs"
                >
                  Start Free
                </Button>
              </div>

              {/* Free Trial */}
              <div className="p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-blue-500/20 rounded-2xl flex flex-col relative">
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-2 py-1 rounded-full text-xs font-bold">
                    🎉 FREE Trial
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">3-Day Premium Trial</h3>
                <div className="text-2xl font-bold text-blue-400 mb-2">FREE</div>
                <p className="text-gray-400 mb-3 text-xs"><span className="text-green-400 font-semibold">No credit card needed.</span></p>
                <ul className="space-y-1 mb-4 flex-grow">
                  {[
                    '3-day unlimited access',
                    'Unlimited receipts & Sage chat',
                    'All premium features',
                    'No payment required'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <Check className="h-3 w-3 text-blue-400" />
                      <span className="text-gray-300 text-xs">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={handleGoPremium}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-2 rounded-lg text-xs"
                >
                  Start FREE Trial
                </Button>
              </div>
            </motion.div>

            {/* Premium Monthly - HERO PLAN - Center */}
            <motion.div
              variants={fadeInUp}
              className="p-8 bg-gradient-to-br from-violet-500/40 to-blue-500/40 backdrop-blur-sm border-2 border-violet-400/80 rounded-3xl flex flex-col relative transform scale-105 shadow-2xl shadow-violet-500/20"
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-violet-500 to-purple-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                  MOST POPULAR
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Premium Monthly</h3>
              <div className="text-4xl font-bold text-white mb-3">
                <span className="text-lg text-gray-400 line-through">$6.99</span> $4.99<span className="text-lg text-gray-400">/month</span>
              </div>
              <p className="text-gray-400 mb-8">For serial overthinkers</p>
              <ul className="space-y-4 mb-8 flex-grow">
                {[
                  'Unlimited Truth Receipts',
                  'Unlimited Sage Companion',
                  'Sage\'s Immunity Training',
                  'Vibe Check™ real-time detection',
                  'Cancel anytime'
                ].map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-violet-400" />
                    <span className="text-gray-300 font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={handleGoPremium}
                className="w-full bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 text-white py-3 rounded-xl text-lg font-semibold shadow-lg"
              >
                Go Premium Monthly
              </Button>
            </motion.div>

            {/* Founder's Club - Right */}
            <motion.div
              variants={fadeInUp}
              className="p-8 bg-gradient-to-br from-violet-500/20 to-purple-500/20 backdrop-blur-sm border-2 border-violet-500/50 rounded-3xl flex flex-col relative shadow-xl shadow-violet-500/10"
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-violet-500 to-purple-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                  Sage's Pick
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">OG Founder's Club</h3>
              <div className="text-4xl font-bold text-white mb-3">
                <span className="text-lg text-gray-400 line-through">$49.99</span> $29.99<span className="text-lg text-gray-400">/year</span>
              </div>
                <p className="text-gray-400 mb-8">For the ones ready to trust their gut</p>
              <ul className="space-y-4 mb-8 flex-grow">
                {[
                  'Everything in Premium +',
                  'Founder\'s Circle membership',
                  'Lifetime price lock',
                  'Exclusive beta access',
                  'Group features coming soon',
                  'Save 40% - Limited time'
                ].map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-violet-400" />
                    <span className="text-gray-300 font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={handleGoPremium}
                className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white py-3 rounded-xl text-lg font-semibold shadow-lg"
              >
                Lock in Founder Price
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How Founder Pricing Works Section */}
      <section className="relative px-6 lg:px-8 py-12">
        <div className="mx-auto max-w-4xl">
          <motion.div 
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent blur-3xl"></div>
              <div className="relative bg-gradient-to-br from-slate-900/60 via-purple-900/20 to-slate-900/60 backdrop-blur-xl rounded-3xl border border-purple-500/20 p-6 md:p-8 text-center">
                
                <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{color: '#C3B1E1'}}>
                  How Founder Pricing Works
                </h2>
                
                <div className="text-lg text-gray-200 mb-4 max-w-3xl mx-auto leading-relaxed">
                  <p className="text-white">
                    As our community grows, Sage's annual price increases:
                  </p>
                </div>

                {/* Tiered Pricing List */}
                <div className="max-w-2xl mx-auto mb-4">
                  <div className="space-y-3 text-left">
                    <div className="flex items-center gap-3 p-3 bg-violet-500/10 border border-violet-500/20 rounded-lg">
                      <span className="text-violet-400 text-2xl">✅</span>
                      <span className="text-violet-400 text-lg">First 200 users: <span className="text-violet-400 font-semibold">$19/year</span> <span className="text-violet-400">(SOLD OUT)</span></span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-violet-500/20 border border-violet-500/30 rounded-lg">
                      <span className="text-violet-300 text-2xl">🔥</span>
                      <span className="text-violet-300 text-lg">Users 201-500: <span className="text-violet-300 font-semibold">$29.99/year</span> <span className="text-violet-300">(Only 73 spots left!)</span></span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-500/10 border border-slate-500/20 rounded-lg">
                      <span className="text-slate-400 text-2xl">📈</span>
                      <span className="text-slate-400 text-lg">Users 501+: <span className="text-slate-400 font-semibold">$49.99/year</span> <span className="text-slate-400">(Regular price)</span></span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-300 mb-3 max-w-2xl mx-auto">
                  The $19 price is gone forever, but you can still lock in $29.99 before it jumps to $49.99.
                </p>

                <p className="text-lg text-violet-300 mb-4 max-w-2xl mx-auto sm:whitespace-nowrap break-words">
                  Once you lock in a founder price, it <strong className="text-violet-200">never changes</strong> - even when <strong className="text-violet-200">everyone else pays more</strong>.
                </p>

                {/* Call-to-Action Block - Compact Horizontal Design */}
                <div className="max-w-2xl mx-auto mb-6">
                  <div className="relative bg-gradient-to-br from-slate-800/80 via-violet-900/30 to-slate-800/80 backdrop-blur-xl rounded-2xl border border-violet-500/30 p-4 text-center">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-2xl font-bold text-white">$29.99/year</div>
                      <div className="text-white">73 spots left at this price</div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-slate-600 rounded-full h-3 mb-3">
                      <div 
                        className="bg-gradient-to-r from-violet-400 to-violet-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${(100 - spotsLeft)}%` }}
                      ></div>
                    </div>
                    
                    <div className="text-sm text-white">
                      Price jumps to $49.99 in <span className={`ticker-counter font-bold ${isChanging ? 'changing' : ''}`}>{spotsLeft}</span> signups
                    </div>
                  </div>
                </div>

                <Button
                  className="bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 shadow-xl shadow-violet-500/30 transform hover:scale-105"
                  onClick={() => handleCheckout('price_1RzgBYG71EqeOEZer7ojcw0R', 'OG Founder')}
                >
                  👑 Claim OG Founder Status
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section id="get-started" className="relative px-6 lg:px-8 py-32">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="bg-gradient-to-br from-violet-500/20 to-blue-500/20 backdrop-blur-sm border border-violet-500/30 rounded-3xl p-12"
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-4xl md:text-6xl font-bold mb-6 moving-gradient-text"
            >
              Ready for Sage's Take?
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              Join thousands who finally got the perspective they needed. Get your first receipt free.
            </motion.p>
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <Button
                onClick={handleGetStarted}
                size="lg"
                className="bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-purple-700 text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-2xl shadow-violet-500/25 transition-all duration-300 hover:scale-105"
              >
                Get My Free Receipt
                <Rocket className="ml-2 h-5 w-5" />
              </Button>
              <Button
                onClick={handleGoPremium}
                variant="outline"
                size="lg"
                className="border-white/20 text-white hover:bg-white/10 px-8 py-4 rounded-2xl text-lg font-semibold"
              >
                See Pricing
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative px-6 lg:px-8 py-16 border-t border-white/10">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-400 to-blue-500 rounded-xl flex items-center justify-center">
                  <span className="text-xl">🔮</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                  Get The Receipts
                </span>
              </div>
              <p className="text-gray-400 max-w-md">
                Stop second-guessing their texts. Get clarity in 60 seconds with Sage, your AI bestie with opinions.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <div className="space-y-2">
                <Link to="/about" className="block text-gray-400 hover:text-white transition-colors">About</Link>
                <Link to="/pricing" className="block text-gray-400 hover:text-white transition-colors">Pricing</Link>
                <Link to="/refer" className="block text-gray-400 hover:text-white transition-colors">Earn & Refer</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <div className="space-y-2">
                <Link to="/privacy-policy" className="block text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
                <Link to="/terms-of-service" className="block text-gray-400 hover:text-white transition-colors">Terms of Service</Link>
                <Link to="/refund-policy" className="block text-gray-400 hover:text-white transition-colors">Refund Policy</Link>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 text-center">
            <p className="text-gray-400 text-sm mb-3">
              © 2025 Get The Receipts. All rights reserved.
            </p>
            <p className="text-gray-500 text-sm mb-3">
              16+ only • For Entertainment Purposes Only • Not therapy, legal, or medical advice • Sage is an AI character with opinions, not facts
            </p>
            <p className="text-gray-600 text-sm">
              Support: <a href="mailto:support@getthereceipts.com" className="text-violet-400 hover:text-violet-300 transition-colors">support@getthereceipts.com</a>
            </p>
          </div>
        </div>
      </footer>

      {/* Sage Floating Companion */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8, type: "spring" }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        className="fixed bottom-8 right-8 z-50 cursor-pointer"
      >
        <div className="relative">
          <img 
            src={sagePurpleSwirl} 
            alt="Sage - Your AI Dating Advisor"
            className="w-16 h-16 object-contain drop-shadow-lg animate-bounce"
            style={{ animationDuration: '3s', animationIterationCount: 'infinite' }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-blue-500 rounded-full blur-lg opacity-20" />
        </div>
      </motion.div>
      
      {/* CSS Animations for Ticker Counter */}
      <style>{`
        @keyframes tickerPulse {
          0% { color: #fbbf24; }
          50% { color: #f59e0b; }
          100% { color: #fbbf24; }
        }
        
        @keyframes tickerChange {
          0% { transform: scale(1); color: #fbbf24; }
          50% { transform: scale(1.1); color: #ef4444; }
          100% { transform: scale(1); color: #fbbf24; }
        }
        
        .ticker-counter {
          animation: tickerPulse 2s ease-in-out infinite;
        }
        
        .ticker-counter.changing {
          animation: tickerChange 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;