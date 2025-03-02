import markdownHtml from "zenn-markdown-html";

export default async function markdownToHtml(markdown: string) {
  // Zenn の記法を使用して Markdown を HTML に変換
  const result = markdownHtml(markdown);
  return result;
}
