import React from 'react';
import TopNavigation from '@/components/TopNavigation';

interface FullScreenLayoutProps {
  children: React.ReactNode;
}

export default function FullScreenLayout({ children }: FullScreenLayoutProps) {
  return (
    <div className="w-full min-h-screen">
      <TopNavigation />
      <div className="pt-20">
        {children}
      </div>
    </div>
  );
}
