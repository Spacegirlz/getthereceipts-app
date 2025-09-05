// Trend Statistics API Mock
// In production, this would be a real API endpoint that tracks archetype frequencies

// Mock daily stats (would be computed via cron job in backend)
const mockDailyStats = {
  date: new Date().toISOString().split('T')[0],
  totalReceipts: 18432,
  archetypes: {
    "The Breadcrumber 🍞": { 
      count: 5714, 
      percentage: 31, 
      weeklyChange: 12,
      trend: 'up'
    },
    "The Gaslighter 🔥": { 
      count: 5161, 
      percentage: 28, 
      weeklyChange: 18,
      trend: 'up'
    },
    "The Future Faker 🎭": { 
      count: 4055, 
      percentage: 22, 
      weeklyChange: -5,
      trend: 'down'
    },
    "The Ghoster 👻": { 
      count: 3502, 
      percentage: 19, 
      weeklyChange: 0,
      trend: 'stable'
    },
    "The Love Bomber 💣": { 
      count: 2765, 
      percentage: 15, 
      weeklyChange: 7,
      trend: 'up'
    },
    "The Hot & Cold ❄️": { 
      count: 4425, 
      percentage: 24, 
      weeklyChange: -3,
      trend: 'down'
    },
    "The Jealous Auditor 🧾": {
      count: 3317,
      percentage: 18,
      weeklyChange: 15,
      trend: 'up'
    },
    "The Emotional Leech 🧛": {
      count: 2214,
      percentage: 12,
      weeklyChange: -8,
      trend: 'down'
    },
    "The Coward King 👑": {
      count: 2765,
      percentage: 15,
      weeklyChange: 4,
      trend: 'up'
    },
    "The Communication Addicts 💬": {
      count: 1843,
      percentage: 10,
      weeklyChange: -2,
      trend: 'down'
    },
    "The Boundary Bosses 🚧": {
      count: 922,
      percentage: 5,
      weeklyChange: 1,
      trend: 'stable'
    }
  },
  regions: {
    "US-West": { topArchetype: "The Breadcrumber 🍞", percentage: 34 },
    "US-East": { topArchetype: "The Gaslighter 🔥", percentage: 29 },
    "US-Central": { topArchetype: "The Future Faker 🎭", percentage: 25 },
    "Global": { topArchetype: "The Breadcrumber 🍞", percentage: 31 }
  }
};

// Get trend data for a specific archetype
export const getTrendData = async (archetype) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const stats = mockDailyStats.archetypes[archetype];
  if (stats) {
    return {
      percentage: stats.percentage,
      trend: stats.trend,
      change: stats.weeklyChange,
      totalToday: stats.count,
      globalRank: Object.keys(mockDailyStats.archetypes)
        .sort((a, b) => mockDailyStats.archetypes[b].count - mockDailyStats.archetypes[a].count)
        .indexOf(archetype) + 1
    };
  }
  
  // Fallback for unknown archetypes
  return {
    percentage: Math.floor(Math.random() * 35) + 10,
    trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)],
    change: Math.floor(Math.random() * 20) - 10,
    totalToday: Math.floor(Math.random() * 5000) + 1000,
    globalRank: Math.floor(Math.random() * 10) + 1
  };
};

// Get today's top trending archetypes
export const getTopTrending = async () => {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const sorted = Object.entries(mockDailyStats.archetypes)
    .filter(([_, data]) => data.trend === 'up')
    .sort((a, b) => b[1].weeklyChange - a[1].weeklyChange)
    .slice(0, 3);
  
  return sorted.map(([archetype, data]) => ({
    archetype,
    ...data
  }));
};

// Get regional data
export const getRegionalTrends = async (region = 'Global') => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockDailyStats.regions[region] || mockDailyStats.regions['Global'];
};

// Track a new receipt (would increment counters in production)
export const trackReceipt = async (archetype) => {
  // In production, this would:
  // 1. Increment the archetype counter
  // 2. Update percentages
  // 3. Store user's receipt for their history
  // 4. Update regional stats based on IP/location
  
  console.log('Tracking receipt for:', archetype);
  return { success: true };
};

// Get share caption with trend data
export const getTrendShareCaption = (archetype, trendData) => {
  const { percentage, trend, change } = trendData;
  
  const templates = {
    up: [
      `📈 ${archetype} is trending at ${percentage}% today (+${change}% this week). The streets are NOT okay.`,
      `Apparently ${percentage}% of us got ${archetype} today. It's up ${change}% from last week. We're all in this together 😭`,
      `PSA: ${archetype} spiked to ${percentage}% of receipts (+${change}% weekly). Stay safe out there.`
    ],
    down: [
      `📉 Only ${percentage}% got ${archetype} today (${change}% from last week). Nature is healing? 🌱`,
      `${archetype} down to ${percentage}% of receipts. We're learning! Down ${Math.abs(change)}% this week.`,
      `Good news: ${archetype} dropped to ${percentage}% (${change}% weekly). Progress.`
    ],
    stable: [
      `${percentage}% of receipts were ${archetype} today. Consistently trash behavior. Some things never change.`,
      `${archetype} holding steady at ${percentage}%. The consistency is almost impressive.`,
      `Another day, another ${percentage}% getting ${archetype}. Clockwork.`
    ]
  };
  
  const options = templates[trend || 'stable'];
  return options[Math.floor(Math.random() * options.length)];
};

export default {
  getTrendData,
  getTopTrending,
  getRegionalTrends,
  trackReceipt,
  getTrendShareCaption
};