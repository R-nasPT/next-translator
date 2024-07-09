import { useState, useEffect, useRef, RefObject } from "react";

interface UseOutsideClickResult {
  ref: RefObject<HTMLDivElement>;
  isOpen: boolean;
  toggleOpen: () => void;
  onClose: () => void;
}

function useOutsideClick(initialIsOpen: boolean = false): UseOutsideClickResult {
  const [isOpen, setIsOpen] = useState<boolean>(initialIsOpen);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  return { ref, isOpen, toggleOpen, onClose };
}

export default useOutsideClick;
