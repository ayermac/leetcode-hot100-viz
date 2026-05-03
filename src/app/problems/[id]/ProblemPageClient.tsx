'use client';

import { useState } from 'react';
import { useLanguagePreference } from '@/hooks/useLanguagePreference';
import { Problem } from '@/lib/data/types';
import { ProblemDescription } from '@/components/ProblemDescription';
import { SolutionTabs } from '@/components/SolutionTabs';
import { CodeViewer } from '@/components/CodeViewer';
import { VisualizationSection, isVisualizationSupported } from '@/components/VisualizationSection';

interface ProblemPageClientProps {
  problem: Problem;
  descriptionHtml: string;
  lifeScenarioHtml: string | null;
}

export function ProblemPageClient({ problem, descriptionHtml, lifeScenarioHtml }: ProblemPageClientProps) {
  const { language, setLanguage } = useLanguagePreference();
  const hasVisualization = isVisualizationSupported(problem.id);
  const [currentCodeLine, setCurrentCodeLine] = useState(0);

  // Get the first solution for code display
  const firstSolution = problem.solutions[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <div className="space-y-6">
        <ProblemDescription
          description={descriptionHtml}
          lifeScenario={lifeScenarioHtml ?? undefined}
        />
      </div>

      <div>
        {hasVisualization ? (
          // Code above, animation below per D-06
          <div className="space-y-6">
            {/* Code section */}
            {firstSolution && (
              <div>
                <CodeViewer
                  solution={firstSolution}
                  language={language}
                  onLanguageChange={setLanguage}
                  highlightLine={currentCodeLine}
                />
              </div>
            )}

            {/* Animation section */}
            <div className="rounded-lg border overflow-hidden">
              <div className="px-4 py-2 bg-muted">
                <h3 className="font-semibold">动画演示</h3>
              </div>
              <div className="p-4">
                <VisualizationSection
                  problemId={problem.id}
                  onCodeLineChange={setCurrentCodeLine}
                />
              </div>
            </div>
          </div>
        ) : (
          <SolutionTabs
            solutions={problem.solutions}
            selectedLanguage={language}
            onLanguageChange={setLanguage}
          />
        )}
      </div>
    </div>
  );
}
