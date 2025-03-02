"use client";

import "zenn-content-css";
import { useEffect } from "react";
import markdownStyles from "./markdown-styles.module.css";

type Props = {
  content: string;
};

export function PostBody({ content }: Props) {
  useEffect(() => {
    // zenn-embed-elementsを動的にインポート
    import("zenn-embed-elements");
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <div
        className={`znc ${markdownStyles["markdown"]}`}
        dangerouslySetInnerHTML={{ __html: content }}
        suppressHydrationWarning
      />
    </div>
  );
}
