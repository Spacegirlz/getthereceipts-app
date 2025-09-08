import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

/**
 * LinkButton - A Button component wrapped in a React Router Link
 * Fixes navigation issues where onClick with navigate() doesn't properly render components
 */
const LinkButton = ({ to, children, className, variant, size, ...props }) => {
  return (
    <Link to={to} style={{ textDecoration: 'none' }}>
      <Button 
        className={className} 
        variant={variant} 
        size={size}
        {...props}
      >
        {children}
      </Button>
    </Link>
  );
};

export default LinkButton;