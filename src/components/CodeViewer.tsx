'use client';

import { useState, useEffect, useRef } from 'react';
import { Solution, CodeBlock } from '@/lib/data/types';
import { Language } from '@/hooks/useLanguagePreference';
import { LanguageSelector } from './LanguageSelector';
import { highlightCode } from '@/lib/shiki';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CodeViewerProps {
  solution: Solution;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  highlightLine?: number;  // 1-indexed, 0 means no highlight
}

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={handleCopy}
      className="h-6 w-6"
    >
      {copied ? (
        <Check className="h-3 w-3" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
      <span className="sr-only">
        {copied ? '已复制' : '复制代码'}
      </span>
    </Button>
  );
}

function LineNumbers({ count, highlightLine }: { count: number; highlightLine: number }) {
  return (
    <div className="absolute left-0 top-0 bottom-0 w-12 bg-muted/50 text-right pr-2 text-xs leading-6 select-none font-mono text-muted-foreground overflow-hidden">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i + 1}
          className={cn(
            'px-2',
            highlightLine === i + 1 && 'bg-yellow-200 dark:bg-yellow-800 text-foreground font-bold'
          )}
        >
          {i + 1}
        </div>
      ))}
    </div>
  );
}

interface CodeContentProps {
  code: string;
  language: Language;
  highlightLine: number;
  availableLanguages: Language[];
  selectedLanguage: Language;
  onLanguageChange: (lang: Language) => void;
}

function CodeContent({
  code,
  language,
  highlightLine,
  availableLanguages,
  selectedLanguage,
  onLanguageChange,
}: CodeContentProps) {
  const [highlightedCode, setHighlightedCode] = useState<string>('');
  const codeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    highlightCode(code, language).then(setHighlightedCode);
  }, [code, language]);

  // Auto-scroll to highlighted line per D-05
  useEffect(() => {
    if (highlightLine > 0 && codeRef.current) {
      const lineElements = codeRef.current.querySelectorAll('.line');
      const targetLine = lineElements[highlightLine - 1];
      if (targetLine) {
        targetLine.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [highlightLine, highlightedCode]);

  const lineCount = code.split('\n').length;

  return (
    <div className="rounded-lg border overflow-hidden" ref={codeRef}>
      <div className="flex items-center justify-between px-4 py-2 bg-muted">
        <LanguageSelector
          availableLanguages={availableLanguages}
          selectedLanguage={selectedLanguage}
          onLanguageChange={onLanguageChange}
        />
        <CopyButton code={code} />
      </div>
      <div className="relative">
        <LineNumbers count={lineCount} highlightLine={highlightLine} />
        <div
          className={cn(
            'pl-14 overflow-x-auto py-1',
            '[&_.line]:px-1',
            highlightLine > 0 && `[&_.line:nth-child(${highlightLine})]:bg-yellow-100`,
            highlightLine > 0 && `[&_.line:nth-child(${highlightLine})]:dark:bg-yellow-900`
          )}
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
      </div>
    </div>
  );
}

export function CodeViewer({ solution, language, onLanguageChange, highlightLine = 0 }: CodeViewerProps) {
  // Extract available languages
  const availableLanguages = solution.codeBlocks.map(cb => cb.language) as Language[];

  // Find code block for selected language, fallback to first available
  let codeBlock: CodeBlock | undefined = solution.codeBlocks.find(
    cb => cb.language === language
  );
  if (!codeBlock && solution.codeBlocks.length > 0) {
    codeBlock = solution.codeBlocks[0];
  }

  if (!codeBlock) {
    return <div className="text-muted-foreground">暂无代码</div>;
  }

  return (
    <CodeContent
      code={codeBlock.code}
      language={codeBlock.language as Language}
      highlightLine={highlightLine}
      availableLanguages={availableLanguages}
      selectedLanguage={codeBlock.language as Language}
      onLanguageChange={onLanguageChange}
    />
  );
}
