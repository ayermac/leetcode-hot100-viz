'use client';

import { Solution } from '@/lib/data/types';
import { Language } from '@/hooks/useLanguagePreference';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CodeViewer } from './CodeViewer';

interface SolutionTabsProps {
  solutions: Solution[];
  selectedLanguage: Language;
  onLanguageChange: (lang: Language) => void;
}

export function SolutionTabs({
  solutions,
  selectedLanguage,
  onLanguageChange,
}: SolutionTabsProps) {
  if (solutions.length === 0) {
    return <div className="text-muted-foreground">暂无题解</div>;
  }

  return (
    <Tabs defaultValue={solutions[0].title} className="w-full">
      <TabsList>
        {solutions.map((solution) => (
          <TabsTrigger key={solution.title} value={solution.title}>
            {solution.title}
          </TabsTrigger>
        ))}
      </TabsList>
      {solutions.map((solution) => (
        <TabsContent key={solution.title} value={solution.title}>
          <div className="mb-4 text-sm text-muted-foreground">
            {solution.explanation}
          </div>
          <CodeViewer
            solution={solution}
            language={selectedLanguage}
            onLanguageChange={onLanguageChange}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}