"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MENU_ITEMS = [
  { text: "Home", href: "/" },
  { text: "Articles", href: "/posts" },
  { text: "Contact", href: "https://futene-web-design-dev.vercel.app/contact", external: true },
];

export function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const dotRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const currentIndex = useRef<number>(0);
  const isHovering = useRef<boolean>(false);
  const isExpanded = useRef<boolean>(true);
  const pathname = usePathname();
  const animationsSetupDone = useRef<boolean>(false);

  useEffect(() => {
    // 現在のパスに基づいてアクティブなメニュー項目を設定
    const activeIndex = MENU_ITEMS.findIndex(item => 
      item.href === pathname || 
      (pathname.startsWith('/posts/') && item.href === '/posts')
    );
    
    if (activeIndex >= 0) {
      currentIndex.current = activeIndex;
    }

    const animations = new Map(); // アニメーション状態を管理

    // ロゴのアニメーション
    if (logoRef.current) {
      gsap.from(logoRef.current, {
        y: -50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.2
      });
    }

    // アニメーションのセットアップは一度だけ行う
    if (!animationsSetupDone.current) {
      // メニュー項目のアニメーション設定
      itemRefs.current.forEach((item, idx) => {
        if (!item) return;

        // 初期アニメーション
        gsap.from(item, {
          y: -20,
          opacity: 0,
          duration: 0.5,
          delay: 0.3 + idx * 0.1,
          ease: "power2.out"
        });

        // 既存のラッパーがあれば削除（クリーンアップ）
        const existingWrapper = item.querySelector('div');
        if (existingWrapper) {
          item.textContent = existingWrapper.textContent;
        }

        const text = item.textContent || "";
        const wrapper = document.createElement("div");
        wrapper.className = "relative overflow-hidden h-full";

        const current = document.createElement("span");
        current.textContent = text;
        current.className = "inline-block";

        const hover = document.createElement("span");
        hover.textContent = text;
        hover.className = "absolute top-full left-0 opacity-0";

        wrapper.appendChild(current);
        wrapper.appendChild(hover);
        item.textContent = "";
        item.appendChild(wrapper);

        const handleMouseEnter = () => {
          // 既存のアニメーションをキル
          if (animations.has(item)) {
            animations.get(item).kill();
          }

          const tl = gsap.timeline();
          tl.to(current, {
            rotateX: -90,
            y: "-50%",
            duration: 0.3,
            ease: "power2.in",
          }).to(
            hover,
            {
              rotateX: 0,
              y: "-100%",
              opacity: 1,
              duration: 0.3,
              ease: "power2.out",
            },
            "-=0.1"
          );

          animations.set(item, tl);
        };

        const handleMouseLeave = () => {
          // 既存のアニメーションをキル
          if (animations.has(item)) {
            animations.get(item).kill();
          }

          const tl = gsap.timeline();
          tl.to(hover, {
            rotateX: 90,
            y: "0%",
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
          }).to(
            current,
            {
              rotateX: 0,
              y: "0%",
              duration: 0.3,
              ease: "power2.out",
            },
            "-=0.1"
          );

          animations.set(item, tl);
        };

        item.addEventListener("mouseenter", handleMouseEnter);
        item.addEventListener("mouseleave", handleMouseLeave);
      });

      // メニューアイテムにホバーイベントを追加
      itemRefs.current.forEach((item, index) => {
        if (!item) return;

        item.addEventListener("mouseenter", () => {
          isHovering.current = true;
          animateDot(index);
        });

        item.addEventListener("mouseleave", () => {
          isHovering.current = false;
          // 少し待ってから、他のメニューにホバーしていなければアクティブなメニューに戻る
          setTimeout(() => {
            if (!isHovering.current) {
              animateDot(currentIndex.current);
            }
          }, 100);
        });
      });

      animationsSetupDone.current = true;
    }

    // ドットのアニメーション
    const animateDot = (targetIndex: number) => {
      if (!dotRef.current || !itemRefs.current[targetIndex]) return;

      const targetEl = itemRefs.current[targetIndex];
      const targetRect = targetEl.getBoundingClientRect();
      const navRect = navRef.current?.getBoundingClientRect() || { left: 0 };
      const currentPos = dotRef.current.getBoundingClientRect();
      
      const targetLeft = targetRect.left - navRect.left + targetRect.width / 2;
      const distance = Math.abs(targetLeft - currentPos.left);

      gsap
        .timeline()
        .to(dotRef.current, {
          scaleX: 1 + Math.min(distance / 30, 1.5),
          left: targetLeft,
          duration: 0.5,
          ease: "power2.inOut",
        })
        .to(
          dotRef.current,
          {
            scaleX: 1,
            duration: 0.25,
            ease: "power2.out",
          },
          "-=0.1"
        );

      currentIndex.current = targetIndex;
    };

    // 初期位置に設定
    animateDot(currentIndex.current);

    // スクロールとホバーの制御
    let scrollTimeout: NodeJS.Timeout;
    let lastScrollY = window.scrollY;
    let isScrollingDown = false;

    const handleScroll = () => {
      if (!headerRef.current || !navRef.current) return;

      // スクロール方向を検出
      const currentScrollY = window.scrollY;
      isScrollingDown = currentScrollY > lastScrollY;
      lastScrollY = currentScrollY;

      // ヘッダーの背景色を調整
      if (currentScrollY > 50) {
        headerRef.current.classList.add('bg-white', 'dark:bg-slate-900', 'shadow-md');
        headerRef.current.classList.remove('bg-transparent');
      } else {
        headerRef.current.classList.remove('bg-white', 'dark:bg-slate-900', 'shadow-md');
        headerRef.current.classList.add('bg-transparent');
      }

      // スクロール中は処理をスキップ
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (currentScrollY <= 50) {
          // トップ付近ではメニューを展開
          gsap.to(navRef.current, {
            y: 0,
            opacity: 1,
            duration: 0.4,
            ease: "power2.out",
          });
          isExpanded.current = true;
        } else if (
          !isHovering.current &&
          isScrollingDown &&
          isExpanded.current
        ) {
          // 下スクロール時にメニューを隠す
          gsap.to(navRef.current, {
            y: -10,
            opacity: 0.7,
            duration: 0.4,
            ease: "power2.inOut",
          });
          isExpanded.current = false;
        } else if (!isScrollingDown && !isExpanded.current) {
          // 上スクロール時にメニューを表示
          gsap.to(navRef.current, {
            y: 0,
            opacity: 1,
            duration: 0.4,
            ease: "power2.out",
          });
          isExpanded.current = true;
        }
      }, 150);
    };

    const handleNavHover = () => {
      if (!navRef.current || isExpanded.current) return;

      gsap.to(navRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
      });
      isExpanded.current = true;
    };

    window.addEventListener("scroll", handleScroll);
    navRef.current?.addEventListener("mouseenter", handleNavHover);

    // 初期状態を設定
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      navRef.current?.removeEventListener("mouseenter", handleNavHover);
      clearTimeout(scrollTimeout);
      
      // イベントリスナーのクリーンアップ
      if (animationsSetupDone.current) {
        itemRefs.current.forEach((item) => {
          if (!item) return;
          const wrapper = item.querySelector('div');
          if (wrapper) {
            const current = wrapper.querySelector('span:first-child');
            const hover = wrapper.querySelector('span:last-child');
            
            if (current) {
              gsap.killTweensOf(current);
            }
            
            if (hover) {
              gsap.killTweensOf(hover);
            }
          }
        });
      }
      
      animations.forEach((tl) => tl.kill());
    };
  }, [pathname]);

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 w-full px-4 md:px-8 py-4 z-50 flex justify-between items-center transition-all duration-300 bg-white shadow-sm"
    >
      <div 
        ref={logoRef}
        className="flex items-center"
      >
        <Link href="/" className="text-xl md:text-2xl font-bold text-gray-900">
          Futene Tech Lab
        </Link>
      </div>
      
      <nav
        ref={navRef}
        className="relative"
      >
        <ul className="flex space-x-1 md:space-x-6 items-center text-sm md:text-base">
          <div
            ref={dotRef}
            className="absolute bottom-0 h-1 w-1 bg-blue-500 rounded-full"
            style={{ left: 0, transformOrigin: "center" }}
          />
          
          {MENU_ITEMS.map((item, index) => {
            const isActive = 
              !item.external && (
                item.href === pathname || 
                (pathname.startsWith('/posts/') && item.href === '/posts')
              );
              
            return (
              <li key={item.text} className="relative py-2">
                {item.external ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative inline-block transition-colors py-1 px-1 text-gray-700 hover:text-blue-600"
                  >
                    <span
                      ref={(el) => {
                        itemRefs.current[index] = el;
                      }}
                      className="inline-block perspective-500"
                    >
                      {item.text}
                    </span>
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    className={`relative inline-block transition-colors py-1 px-1 ${
                      isActive 
                        ? 'text-blue-600 font-medium' 
                        : 'text-gray-700 hover:text-blue-600'
                    }`}
                  >
                    <span
                      ref={(el) => {
                        itemRefs.current[index] = el;
                      }}
                      className="inline-block perspective-500"
                    >
                      {item.text}
                    </span>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
