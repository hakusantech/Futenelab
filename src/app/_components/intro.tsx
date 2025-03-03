"use client";

import { useEffect, useRef, ReactNode } from "react";
import gsap from "gsap";
import { TextAnimator } from "./text-animator";

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
  const titleRef = useRef<HTMLHeadingElement>(null);
  const decorationRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // キャッチフレーズのアニメーション
    if (catchphraseRef.current) {
      gsap.fromTo(
        catchphraseRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, delay: 0.5, ease: "power2.out" }
      );
    }

    // タイトルのアニメーション
    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, delay: 0.8, ease: "power2.out" }
      );
    }

    // 装飾用背景テキストのアニメーション
    if (decorationRef.current) {
      gsap.fromTo(
        decorationRef.current,
        { opacity: 0 },
        { opacity: 0.15, duration: 2, delay: 1.2, ease: "power1.inOut" }
      );
    }

    // スクロールインジケーターのアニメーション
    if (scrollIndicatorRef.current) {
      gsap.to(scrollIndicatorRef.current, {
        y: 15,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        delay: 2
      });
    }
  }, []);

  return (
    <section className="relative flex flex-col items-center justify-center py-28 md:py-36 bg-white px-4 md:px-8 border-b border-gray-100 overflow-hidden">
      {/* 装飾用の背景テキスト */}
      <div 
        ref={decorationRef}
        className="absolute left-4 bottom-4 text-gray-100 select-none font-bold text-[4rem] sm:text-[6rem] md:text-[12rem] tracking-[-0.25rem] md:tracking-[-0.5rem] opacity-0 leading-none"
      >
        <span className="block sm:inline">FUTENE</span>{" "}
        <span className="block sm:inline">LAB</span>
      </div>

      {/* 装飾ライン */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-600"></div>

      {/* コンテンツコンテナ */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* キャッチフレーズ */}
        <p ref={catchphraseRef} className="text-blue-600 text-lg md:text-xl mb-6 font-medium opacity-0">
          <TextAnimator
            targetText="スタートアップ・ホームページ制作・Web開発メディア"
            className="font-medium"
          />
        </p>

        {/* タイトル */}
        <h1 
          ref={titleRef} 
          className="text-gray-800 text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-center mb-8 opacity-0 relative"
        >
          Futene Tech Lab
          <span className="block h-1 w-24 md:w-32 bg-blue-600 mx-auto mt-6"></span>
        </h1>

        {/* サブタイトル */}
        <p className="text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed">
          東大発スタートアップが運営する技術メディア。Web開発、AI活用、スタートアップ向けホームページ制作に関する最新情報を発信します。
        </p>

        {/* ロールインジケーター */}
        <div
          ref={scrollIndicatorRef}
          className="text-gray-400 mt-12 opacity-70"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto"
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
      </div>
    </section>
  );
};

export default Intro;
