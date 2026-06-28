import React from 'react';

interface AdSenseProps {
  slotId?: string;
  className?: string;
  format?: 'auto' | 'fluid' | 'rectangle';
}

export function AdSense({ slotId = 'default-slot', className = '', format = 'auto' }: AdSenseProps) {
  // 실제 광고 로직이 준비되면 이 컴포넌트에서 광고 스크립트/렌더링을 처리한다.
  // 현재는 개발용 Placeholder만 제거하고 빈 공간도 렌더링하지 않는다.
  void slotId;
  void className;
  void format;
  return null;
}
