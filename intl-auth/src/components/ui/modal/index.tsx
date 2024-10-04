"use client";

import { useRouter } from "@/navigation";
import { cn } from "@/utils";
import { useEffect, useState } from "react";

interface ModalProps {
  children: React.ReactNode;
}

export default function Modal({ children }: ModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setOpen(true), 50);
    return () => clearTimeout(timer);
  }, []);
  
  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      router.back();
    }, 300);
  };
  
  return (
    <div
      className={cn(
        "fixed z-[100] inset-0 flex justify-center items-center transition-colors w-screen bg-black/30 backdrop-blur-[2px]",
      )}
      onClick={handleClose}
    >
      <section
        className={cn(
          "flex justify-center items-center transition-all",
          open ? "scale-90 lg:scale-150 opacity-100" : "scale-[2] opacity-0"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </section>
    </div>
  );
}
