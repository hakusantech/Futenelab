"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface TextAnimatorProps {
  targetText: string;
  className?: string;
  duration?: number;
  delay?: number;
}

export const TextAnimator = ({
  targetText,
  className = "",
  duration = 3000,
  delay = 0,
}: TextAnimatorProps) => {
  const [displayText, setDisplayText] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setIsAnimating(true);
      let currentIndex = 0;
      const textLength = targetText.length;
      const intervalTime = duration / textLength;

      const intervalId = setInterval(() => {
        if (currentIndex <= textLength) {
          setDisplayText(targetText.substring(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(intervalId);
          setIsAnimating(false);
        }
      }, intervalTime);

      return () => {
        clearInterval(intervalId);
      };
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [targetText, duration, delay]);

  return (
    <span className={cn(className, isAnimating ? "border-r-2 border-current" : "")}>
      {displayText}
    </span>
  );
};

export default TextAnimator; 