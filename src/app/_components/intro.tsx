"use client";

import { HeroShader } from "./hero-shader";
import { useEffect, useRef, ReactNode } from "react";
import gsap from "gsap";
import { TextAnimator } from "./text-animator";
import { HorizontalWaveAnimation } from "./horizontal-wave-animation";
import { VerticalWaveAnimation } from "./vertical-wave-animation";
import { BackgroundCurves } from "./background-curves";

interface StrongProps {
  children: ReactNode;
  delay?: number;
}

const Strong = ({ children, delay = 0 }: StrongProps) => {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (ref.current) {
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, delay: delay / 1000 }
      );
    }
  }, [delay]);

  return (
    <span ref={ref} className="font-bold">
      {children}
    </span>
  );
};

export const Intro = () => {
  const catchphraseRef = useRef<HTMLParagraphElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (catchphraseRef.current) {
      gsap.fromTo(
        catchphraseRef.current,
        { opacity: 0, x: -100 },
        { opacity: 1, x: 0, duration: 1, delay: 0.5, ease: "power2.out" }
      );
    }

    if (scrollIndicatorRef.current) {
      gsap.to(scrollIndicatorRef.current, {
        y: 15,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
    }
  }, []);

  return (
    <section className="relative flex flex-col items-center justify-center h-screen overflow-hidden bg-neutral-950 px-4 md:px-8">
      <HeroShader />

      {/* 背景アニメーション */}
      <div className="absolute inset-0 opacity-25">
        <HorizontalWaveAnimation className="absolute inset-0" />
        <VerticalWaveAnimation className="absolute inset-0" />
        <BackgroundCurves className="absolute inset-0" />
      </div>

      {/* 装飾用の背景テキスト（スマホでは改行表示） */}
      <div className="absolute left-4 bottom-4 text-neutral-800 select-none font-bold text-[4rem] sm:text-[6rem] md:text-[12rem] tracking-[-0.25rem] md:tracking-[-0.5rem] opacity-20 leading-none">
        <span className="block sm:inline">FUTENE</span>{" "}
        <span className="block sm:inline">LAB</span>
      </div>

      

      {/* ロールインジケーター（中央下部） */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-gray-400"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="animate-pulse"
        >
          <path
            d="M12 5V19M12 19L19 12M12 19L5 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </section>
  );
};

export default Intro;
