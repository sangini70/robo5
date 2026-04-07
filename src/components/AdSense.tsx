import React from 'react';

interface AdSenseProps {
  slotId?: string;
  className?: string;
  format?: 'auto' | 'fluid' | 'rectangle';
}

export function AdSense({ slotId = 'default-slot', className = '', format = 'auto' }: AdSenseProps) {
  // In a real app, this would load the Google AdSense script and push the ad.
  // For this MVP, we use a placeholder to visualize the ad space.
  return (
    <div className={`w-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 text-xs tracking-widest uppercase p-4 my-12 rounded-sm ${className}`} style={{ minHeight: '100px' }}>
      [AdSense Placeholder: {slotId} - {format}]
    </div>
  );
}
