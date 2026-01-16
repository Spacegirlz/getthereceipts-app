export const STORY_ARC_THEMES = [
  {
    id: 'hook',
    gradient: {
      start: '#0BA5EC',
      end: '#6366F1',
      backdrop: 'linear-gradient(180deg, rgba(11,165,236,0.18) 0%, rgba(99,102,241,0.12) 100%)',
    },
    accent: '#22D3EE',
    badge: {
      background: 'rgba(34, 211, 238, 0.12)',
      border: 'rgba(34, 211, 238, 0.35)',
      text: '#0E7490',
    },
    number: {
      background: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)',
      text: '#020617',
    },
    sparkle: 'cyan',
  },
  {
    id: 'pattern',
    gradient: {
      start: '#8B5CF6',
      end: '#EC4899',
      backdrop: 'linear-gradient(180deg, rgba(139,92,246,0.18) 0%, rgba(236,72,153,0.12) 100%)',
    },
    accent: '#C084FC',
    badge: {
      background: 'rgba(192,132,252,0.12)',
      border: 'rgba(192,132,252,0.35)',
      text: '#7C3AED',
    },
    number: {
      background: 'linear-gradient(135deg, #8B5CF6 0%, #F472B6 100%)',
      text: '#F8FAFC',
    },
    sparkle: 'violet',
  },
  {
    id: 'forecast',
    gradient: {
      start: '#F472B6',
      end: '#FB923C',
      backdrop: 'linear-gradient(180deg, rgba(244,114,182,0.18) 0%, rgba(251,146,60,0.12) 100%)',
    },
    accent: '#FDA4AF',
    badge: {
      background: 'rgba(244,114,182,0.14)',
      border: 'rgba(244,114,182,0.35)',
      text: '#BE185D',
    },
    number: {
      background: 'linear-gradient(135deg, #F472B6 0%, #FB923C 100%)',
      text: '#1F2937',
    },
    sparkle: 'pink',
  },
  {
    id: 'move',
    gradient: {
      start: '#F97316',
      end: '#FACC15',
      backdrop: 'linear-gradient(180deg, rgba(249,115,22,0.18) 0%, rgba(250,204,21,0.12) 100%)',
    },
    accent: '#FDBA74',
    badge: {
      background: 'rgba(247, 133, 29, 0.12)',
      border: 'rgba(247,133,29,0.35)',
      text: '#B45309',
    },
    number: {
      background: 'linear-gradient(135deg, #FB923C 0%, #FACC15 100%)',
      text: '#0B1120',
    },
    sparkle: 'amber',
  },
  {
    id: 'shield',
    gradient: {
      start: '#FACC15',
      end: '#34D399',
      backdrop: 'linear-gradient(180deg, rgba(250,204,21,0.18) 0%, rgba(52,211,153,0.12) 100%)',
    },
    accent: '#FACC15',
    badge: {
      background: 'rgba(250,204,21,0.10)',
      border: 'rgba(250,204,21,0.35)',
      text: '#D97706',
    },
    number: {
      background: 'linear-gradient(135deg, #FACC15 0%, #34D399 100%)',
      text: '#1D1F3F',
    },
    sparkle: 'gold',
  },
  {
    id: 'test',
    gradient: {
      start: '#22D3EE',
      end: '#34D399',
      backdrop: 'linear-gradient(180deg, rgba(34,211,238,0.18) 0%, rgba(52,211,153,0.12) 100%)',
    },
    accent: '#34D399',
    badge: {
      background: 'rgba(45,212,191,0.12)',
      border: 'rgba(45,212,191,0.35)',
      text: '#047857',
    },
    number: {
      background: 'linear-gradient(135deg, #22D3EE 0%, #34D399 100%)',
      text: '#022C22',
    },
    sparkle: 'teal',
  },
  {
    id: 'finale',
    gradient: {
      start: '#3B82F6',
      end: '#9333EA',
      backdrop: 'linear-gradient(180deg, rgba(59,130,246,0.22) 0%, rgba(147,51,234,0.16) 100%)',
    },
    accent: '#A855F7',
    badge: {
      background: 'rgba(129,140,248,0.18)',
      border: 'rgba(129,140,248,0.35)',
      text: '#312E81',
    },
    number: {
      background: 'linear-gradient(135deg, #3B82F6 0%, #9333EA 100%)',
      text: '#F8FAFC',
    },
    sparkle: 'prism',
  },
];

export const getStoryArcTheme = (index = 0) => STORY_ARC_THEMES[index % STORY_ARC_THEMES.length];


