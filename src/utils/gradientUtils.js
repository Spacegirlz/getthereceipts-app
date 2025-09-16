// Core Moving Gradient Utility
// Consistent gradient animation used across the application

export const MOVING_GRADIENT_CSS = `
  @keyframes moveGradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  .moving-gradient-text {
    background: linear-gradient(-45deg, #a78bfa, #60a5fa, #3b82f6, #a78bfa);
    background-size: 400% 400%;
    animation: moveGradient 3s ease infinite;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
  }
`;

export const injectMovingGradientStyles = () => {
  // Check if styles are already injected
  if (document.querySelector('#moving-gradient-styles')) {
    return;
  }

  const style = document.createElement('style');
  style.id = 'moving-gradient-styles';
  style.textContent = MOVING_GRADIENT_CSS;
  document.head.appendChild(style);
};

export const removeMovingGradientStyles = () => {
  const existingStyle = document.querySelector('#moving-gradient-styles');
  if (existingStyle) {
    document.head.removeChild(existingStyle);
  }
};

// React Hook for easy integration
export const useMovingGradient = () => {
  React.useEffect(() => {
    injectMovingGradientStyles();
    return () => {
      // Don't remove on cleanup as other components might be using it
      // removeMovingGradientStyles();
    };
  }, []);
};