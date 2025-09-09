import React from 'react';
import { TrendingUp, TrendingDown, Users } from 'lucide-react';

const TrendSticker = ({ archetype, trendData }) => {
  // Mock data for now - would come from API
  const mockTrends = {
    "The Breadcrumber 🍞": { percentage: 31, trend: 'up', change: 12 },
    "The Gaslighter 🔥": { percentage: 28, trend: 'up', change: 18 },
    "The Future Faker 🎭": { percentage: 22, trend: 'down', change: -5 },
    "The Ghoster 👻": { percentage: 19, trend: 'stable', change: 0 },
    "The Love Bomber 💣": { percentage: 15, trend: 'up', change: 7 },
    "The Hot & Cold ❄️": { percentage: 24, trend: 'down', change: -3 },
  };

  // Generate consistent static percentage based on archetype name
  const getStaticPercentage = (name) => {
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return ((hash % 25) + 10); // Returns consistent number between 10-34
  };

  const data = trendData || mockTrends[archetype] || { 
    percentage: getStaticPercentage(archetype),
    trend: 'stable',
    change: 0
  };

  const getTrendIcon = () => {
    if (data.trend === 'up') return <TrendingUp className="w-3 h-3 text-red-400" />;
    if (data.trend === 'down') return <TrendingDown className="w-3 h-3 text-green-400" />;
    return <Users className="w-3 h-3 text-yellow-400" />;
  };

  const getTrendColor = () => {
    if (data.trend === 'up') return 'from-red-500/20 to-orange-500/10 border-red-400/30';
    if (data.trend === 'down') return 'from-green-500/20 to-emerald-500/10 border-green-400/30';
    return 'from-transparent to-transparent border-white/20';
  };

  const getTrendText = () => {
    if (data.trend === 'up') return `+${Math.abs(data.change)}% this week`;
    if (data.trend === 'down') return `${data.change}% this week`;
    return 'steady';
  };

  return (
    <div className="relative group flex justify-center">
      {/* Main Trend Badge */}
      <div className={`
        inline-flex items-center gap-2 px-3 py-1.5 
        bg-gradient-to-r ${getTrendColor()}
        backdrop-blur-sm rounded-full
        transition-all duration-300 hover:scale-105
        cursor-pointer
      `}>
        {getTrendIcon()}
        <span className="text-xs font-bold text-white">
          {data.percentage}% got this today
        </span>
        {data.trend !== 'stable' && (
          <span className="text-[10px] text-white/70 font-medium">
            {getTrendText()}
          </span>
        )}
      </div>

      {/* Hover Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 
                      opacity-0 group-hover:opacity-100 pointer-events-none
                      transition-opacity duration-200 z-50">
        <div className="bg-black/90 backdrop-blur-md rounded-lg px-3 py-2 
                        border border-white/10 shadow-xl min-w-[200px]">
          <div className="text-[10px] text-white/60 mb-1">TRENDING IN YOUR ZONE</div>
          <div className="text-xs text-white font-medium">
            {archetype.replace(' 🔮', '').replace('The ', '')} 
            {data.trend === 'up' && ' is spiking 📈'}
            {data.trend === 'down' && ' is cooling off 📉'}
            {data.trend === 'stable' && ' holding steady 📊'}
          </div>
          {data.trend !== 'stable' && (
            <div className="text-[11px] text-white/80 mt-1">
              {Math.abs(data.change)}% {data.trend === 'up' ? 'increase' : 'decrease'} vs last week
            </div>
          )}
        </div>
        {/* Tooltip Arrow */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
          <div className="w-0 h-0 border-l-[6px] border-l-transparent 
                          border-r-[6px] border-r-transparent 
                          border-t-[6px] border-t-black/90"></div>
        </div>
      </div>
    </div>
  );
};

// Share Caption Generator
export const getTrendCaption = (archetype, percentage, trend) => {
  const captions = {
    up: [
      `Apparently ${percentage}% of us got ${archetype} this week. We're all in this together 😭`,
      `${archetype} is trending at ${percentage}% — the streets are NOT okay`,
      `PSA: ${archetype} spiked to ${percentage}% this week. Stay safe out there.`,
    ],
    down: [
      `Only ${percentage}% got ${archetype} this week. Nature is healing? 🌱`,
      `${archetype} down to ${percentage}% — we're learning!`,
      `Good news: ${archetype} dropped to ${percentage}%. Progress.`,
    ],
    stable: [
      `${percentage}% of receipts were ${archetype}. Consistently trash behavior.`,
      `${archetype} holding steady at ${percentage}%. Some things never change.`,
    ]
  };
  
  const options = captions[trend || 'stable'];
  // Use consistent hash-based selection instead of random
  const hash = (archetype || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return options[hash % options.length];
};

export default TrendSticker;