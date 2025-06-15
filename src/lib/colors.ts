// Brand Colors Configuration
export const colors = {
  blue: '#6f00ff',
  red: '#ff0000',
  yellow: '#ffde1a',
  green: '#0eff00'
} as const;

// CSS Custom Properties for use in Tailwind
export const cssColors = {
  '--brand-blue': '#6f00ff',
  '--brand-red': '#ff0000',
  '--brand-yellow': '#ffde1a',
  '--brand-green': '#0eff00'
} as const;

// Utility function to get color by name
export const getColor = (colorName: keyof typeof colors) => {
  return colors[colorName];
};

// Export for convenience
export const BRAND_COLORS = colors;
