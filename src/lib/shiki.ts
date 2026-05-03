import { createHighlighter, type Highlighter } from 'shiki';

let highlighter: Highlighter | null = null;

export async function getHighlighter(): Promise<Highlighter> {
  if (highlighter) {
    return highlighter;
  }

  highlighter = await createHighlighter({
    themes: ['github-dark'],
    langs: ['go', 'python', 'java'],
  });

  return highlighter;
}

export async function highlightCode(code: string, language: string): Promise<string> {
  const hl = await getHighlighter();

  const html = hl.codeToHtml(code, {
    lang: language,
    theme: 'github-dark',
  });

  return html;
}
