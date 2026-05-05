'use client';

import { useState } from 'react';
import { useLanguagePreference } from '@/hooks/useLanguagePreference';
import { Problem } from '@/lib/data/types';
import { CodeViewer } from '@/components/CodeViewer';
import { VisualizationSection } from '@/components/VisualizationSection';
import { isVisualizationSupported } from '@/lib/constants/problems';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface ProblemPageClientProps {
  problem: Problem;
  descriptionHtml: string;
  lifeScenarioHtml: string | null;
  thoughtProcessHtml: string | null;
  codeExplanationHtml: string | null;
  pitfallsHtml: string | null;
  extensionsHtml: string | null;
  tipsHtml: string | null;
}

export function ProblemPageClient({
  problem,
  descriptionHtml,
  lifeScenarioHtml,
  thoughtProcessHtml,
  codeExplanationHtml,
  pitfallsHtml,
  extensionsHtml,
  tipsHtml,
}: ProblemPageClientProps) {
  const { language, setLanguage } = useLanguagePreference();
  const hasVisualization = isVisualizationSupported(problem.id);
  const [currentCodeLine, setCurrentCodeLine] = useState(0);

  const firstSolution = problem.solutions[0];

  // Check if there are any additional content sections
  const hasAdditionalContent = thoughtProcessHtml || codeExplanationHtml || pitfallsHtml || extensionsHtml || tipsHtml;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      {/* Left column: Problem description and content */}
      <div className="space-y-6">
        {/* Life Scenario */}
        {lifeScenarioHtml && (
          <div className="rounded-lg border overflow-hidden">
            <div className="px-4 py-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <span>💡</span> 生活场景
              </h2>
            </div>
            <div
              className="p-4 prose prose-sm dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: lifeScenarioHtml }}
            />
          </div>
        )}

        {/* Problem Description */}
        {descriptionHtml && (
          <div className="rounded-lg border overflow-hidden">
            <div className="px-4 py-2 bg-muted border-b">
              <h2 className="text-lg font-semibold">📝 问题解析</h2>
            </div>
            <div
              className="p-4 prose prose-sm dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: descriptionHtml }}
            />
          </div>
        )}

        {/* Additional Content Tabs */}
        {hasAdditionalContent && (
          <Tabs defaultValue="thought" className="w-full">
            <TabsList className="w-full justify-start flex-wrap h-auto gap-1 p-1">
              {thoughtProcessHtml && <TabsTrigger value="thought" className="text-xs sm:text-sm">思路历程</TabsTrigger>}
              {codeExplanationHtml && <TabsTrigger value="explain" className="text-xs sm:text-sm">代码详解</TabsTrigger>}
              {pitfallsHtml && <TabsTrigger value="pitfalls" className="text-xs sm:text-sm">易错点</TabsTrigger>}
              {extensionsHtml && <TabsTrigger value="extend" className="text-xs sm:text-sm">举一反三</TabsTrigger>}
              {tipsHtml && <TabsTrigger value="tips" className="text-xs sm:text-sm">面试技巧</TabsTrigger>}
            </TabsList>

            {thoughtProcessHtml && (
              <TabsContent value="thought" className="mt-2">
                <div className="rounded-lg border p-4 prose prose-sm dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: thoughtProcessHtml }}
                />
              </TabsContent>
            )}

            {codeExplanationHtml && (
              <TabsContent value="explain" className="mt-2">
                <div className="rounded-lg border p-4 prose prose-sm dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: codeExplanationHtml }}
                />
              </TabsContent>
            )}

            {pitfallsHtml && (
              <TabsContent value="pitfalls" className="mt-2">
                <div className="rounded-lg border p-4 prose prose-sm dark:prose-invert max-w-none bg-rose-50/50 dark:bg-rose-950/20"
                  dangerouslySetInnerHTML={{ __html: pitfallsHtml }}
                />
              </TabsContent>
            )}

            {extensionsHtml && (
              <TabsContent value="extend" className="mt-2">
                <div className="rounded-lg border p-4 prose prose-sm dark:prose-invert max-w-none bg-emerald-50/50 dark:bg-emerald-950/20"
                  dangerouslySetInnerHTML={{ __html: extensionsHtml }}
                />
              </TabsContent>
            )}

            {tipsHtml && (
              <TabsContent value="tips" className="mt-2">
                <div className="rounded-lg border p-4 prose prose-sm dark:prose-invert max-w-none bg-amber-50/50 dark:bg-amber-950/20"
                  dangerouslySetInnerHTML={{ __html: tipsHtml }}
                />
              </TabsContent>
            )}
          </Tabs>
        )}
      </div>

      {/* Right column: Code and Visualization */}
      <div>
        {hasVisualization ? (
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
              <div className="px-4 py-2 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-b">
                <h3 className="font-semibold flex items-center gap-2">
                  <span>🎬</span> 动画演示
                </h3>
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
          /* No visualization - show code with all solutions */
          <div className="space-y-4">
            {/* Available Languages */}
            {firstSolution && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>可用语言：</span>
                {firstSolution.codeBlocks.map((block, idx) => (
                  <Badge key={`${block.language}-${idx}`} variant="outline" className="text-xs">
                    {block.language === 'go' ? 'Go' : block.language === 'python' ? 'Python' : 'Java'}
                  </Badge>
                ))}
              </div>
            )}

            {problem.solutions.map((solution, index) => (
              <div key={index} className="rounded-lg border overflow-hidden">
                <div className="px-4 py-2 bg-muted border-b">
                  <h3 className="font-semibold">{solution.title}</h3>
                  {solution.explanation && (
                    <p className="text-sm text-muted-foreground mt-1">{solution.explanation.slice(0, 100)}...</p>
                  )}
                </div>
                <div className="p-4">
                  <CodeViewer
                    solution={solution}
                    language={language}
                    onLanguageChange={setLanguage}
                  />
                </div>
              </div>
            ))}

            <div className="p-6 text-center text-muted-foreground bg-muted/50 rounded-lg">
              <p>该题目暂无动画演示</p>
              <p className="text-sm mt-1">
                目前支持 11 道动画题目：两数之和、移动零、盛水容器、三数之和、
                搜索插入位置、最大子数组和、寻找旋转数组最小值、反转链表、环形链表、
                合并有序链表、删除链表倒数第N个节点
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
