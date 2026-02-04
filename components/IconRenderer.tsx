
import React from 'react';
import * as Icons from 'lucide-react';
import { LucideProps } from 'lucide-react';

// Explicitly include strokeWidth and size in the interface to ensure compatibility with all Lucide components and resolve typing issues
interface IconRendererProps extends LucideProps {
  name: string;
  size?: number | string;
  strokeWidth?: number | string;
}

const IconRenderer: React.FC<IconRendererProps> = ({ name, ...props }) => {
  const IconComponent = (Icons as any)[name];
  if (!IconComponent) {
    // Fallback icon if name is invalid
    return <Icons.HelpCircle {...props} />;
  }
  return <IconComponent {...props} />;
};

export default IconRenderer;
