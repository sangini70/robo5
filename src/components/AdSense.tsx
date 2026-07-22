'use client';

import { useEffect, useRef } from 'react';

interface AdSenseProps {
  slotId?: string;
  className?: string;
  format?: 'auto' | 'fluid' | 'rectangle';
}

const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID?.trim() || 'ca-pub-6091782335427561';

const CONTENT_SLOT_ENV_MAP: Record<string, string | undefined> = {
  'content-1': process.env.NEXT_PUBLIC_ADSENSE_CONTENT_SLOT?.trim(),
  'content-2': process.env.NEXT_PUBLIC_ADSENSE_CONTENT_SLOT?.trim(),
  'content-3': process.env.NEXT_PUBLIC_ADSENSE_CONTENT_SLOT?.trim(),
};

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

function resolveContentSlot(slotId: string) {
  return CONTENT_SLOT_ENV_MAP[slotId] || null;
}

export function AdSense({ slotId = 'default-slot', className = '', format = 'auto' }: AdSenseProps) {
  const resolvedSlotId = resolveContentSlot(slotId);
  const hasPushedRef = useRef(false);

  useEffect(() => {
    if (!resolvedSlotId || !ADSENSE_CLIENT_ID || hasPushedRef.current) {
      return;
    }

    hasPushedRef.current = true;

    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch {
      hasPushedRef.current = false;
    }
  }, [resolvedSlotId]);

  if (!resolvedSlotId) {
    return null;
  }

  return (
    <div
      className={[
        'not-prose my-8 w-full max-w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="px-4 pt-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-400 sm:px-5">
        Advertisement
      </div>
      <div className="px-4 pb-4 pt-3 sm:px-5">
        <ins
          className="adsbygoogle block w-full"
          style={{ display: 'block' }}
          data-ad-client={ADSENSE_CLIENT_ID}
          data-ad-slot={resolvedSlotId}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}
