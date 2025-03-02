"use client";

import markdownStyles from "./markdown-styles.module.css";
import { useEffect, useRef } from "react";
import katex from "katex";

type Props = {
  content: string;
};

export function PostBody({ content }: Props) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    // 数式を処理する関数
    const renderMathInElement = () => {
      const element = contentRef.current;
      if (!element) return;

      // 数式を含む可能性のあるすべての要素を取得
      const allElements = element.querySelectorAll('*');
      
      // 各要素のテキストコンテンツを調べる
      allElements.forEach(el => {
        // 子ノードがテキストノードのみの場合に処理
        if (el.childNodes.length === 1 && el.firstChild?.nodeType === Node.TEXT_NODE) {
          const text = el.textContent || '';
          
          // ブロック数式の処理
          if (text.trim().startsWith('$$') && text.trim().endsWith('$$')) {
            const formula = text.trim().slice(2, -2).trim();
            try {
              el.innerHTML = katex.renderToString(formula, {
                displayMode: true,
                throwOnError: false
              });
              el.className += ' katex-block';
            } catch (error) {
              console.error("KaTeX error:", error);
            }
          }
          // インライン数式の処理
          else if (text.includes('$') && !text.includes('$$')) {
            // $で囲まれた部分を検出して置換
            const parts = text.split(/(\$[^\$]+\$)/g);
            if (parts.length > 1) {
              const newHtml = parts.map(part => {
                if (part.startsWith('$') && part.endsWith('$')) {
                  const formula = part.slice(1, -1).trim();
                  try {
                    return katex.renderToString(formula, {
                      displayMode: false,
                      throwOnError: false
                    });
                  } catch (error) {
                    console.error("KaTeX error:", error);
                    return part;
                  }
                }
                return part;
              }).join('');
              
              el.innerHTML = newHtml;
            }
          }
        }
      });
    };

    // 数式処理を実行
    renderMathInElement();
  }, [content]);

  return (
    <div className="max-w-2xl mx-auto">
      <div
        ref={contentRef}
        className={`znc ${markdownStyles["markdown"]}`}
        dangerouslySetInnerHTML={{ __html: content }}
        suppressHydrationWarning
      />
    </div>
  );
}
