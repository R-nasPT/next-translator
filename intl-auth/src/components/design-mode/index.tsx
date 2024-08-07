'use client';

import { useDesignMode } from "@/hooks";

export function DesignModeIndicator() {
  const isDesignMode = useDesignMode();

  // ตรวจสอบว่าเราอยู่ใน development mode หรือ Design Mode ถูกเปิดใช้งาน
  const showIndicator = process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_ENABLE_DESIGN_MODE === 'true';

  if (!isDesignMode || !showIndicator) return null;

  return (
    <div style={{ position: 'fixed', bottom: 10, right: 10, background: 'yellow', padding: '5px' }}>
      Design Mode: ON (Development Only)
    </div>
  );
}
