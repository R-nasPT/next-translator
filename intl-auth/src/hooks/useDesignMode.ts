'use client';

import { useState, useEffect } from 'react';

export default function useDesignMode() {
  const [isDesignMode, setIsDesignMode] = useState(false);

  useEffect(() => {
    // ตรวจสอบว่าเราอยู่ใน development mode หรือไม่
    const isDevelopment = process.env.NODE_ENV === 'development';
    // ตรวจสอบว่า NEXT_PUBLIC_ENABLE_DESIGN_MODE เป็น true หรือไม่
    const isDesignModeEnabled = process.env.NEXT_PUBLIC_ENABLE_DESIGN_MODE === 'true';

    if (!isDevelopment || !isDesignModeEnabled) {
      return; // ไม่ทำงานถ้าไม่ใช่ development mode และไม่ได้เปิดใช้ Design Mode
    }

    const toggleDesignMode = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        setIsDesignMode((prev) => !prev);
      }
    };

    window.addEventListener('keydown', toggleDesignMode);

    return () => {
      window.removeEventListener('keydown', toggleDesignMode);
    };
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined' && 
        (process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_ENABLE_DESIGN_MODE === 'true')) {
      document.designMode = isDesignMode ? 'on' : 'off';
    }
  }, [isDesignMode]);

  return isDesignMode;
}
