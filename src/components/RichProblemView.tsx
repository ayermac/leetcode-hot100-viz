'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RichProblemContent } from '@/lib/data/richContentTypes';
import {
  BookOpen,
  Lightbulb,
  ShoppingCart,
  Code2,
  Table2,
  CheckCircle2,
  XCircle,
  Clock,
  Database,
  ArrowRight,
  ChevronDown,
  Sparkles,
  Target,
  Zap,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface RichProblemViewProps {
  content: RichProblemContent;
}

const StepNumber = ({ number, active = false }: { number: number; active?: boolean }) => (
  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${active ? 'bg-violet-600 text-white' : 'bg-muted text-muted-foreground border border-border'}`}>
    {number}
  </div>
);

export function RichProblemView({ content }: RichProblemViewProps) {
  const [activeSolution, setActiveSolution] = useState(0);
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set([1]));

  const toggleStep = (step: number) => {
    const newSet = new Set(expandedSteps);
    if (newSet.has(step)) {
      newSet.delete(step);
    } else {
      newSet.add(step);
    }
    setExpandedSteps(newSet);
  };

  const currentSolution = content.solutions[activeSolution];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <Card className="border-violet-200 shadow-lg shadow-violet-100">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground tracking-tight">{content.lifeScenario.title}</h2>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-foreground/80 leading-relaxed text-[15px]">{content.lifeScenario.story}</p>
          <div className="mt-5 p-4 rounded-xl bg-gradient-to-r from-violet-50 to-violet-100/50 border border-violet-200">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-violet-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-foreground/80">
                <span className="text-violet-700 font-medium">类比理解：</span>
                {content.lifeScenario.analogy}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">问题描述</h2>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-foreground/80 leading-relaxed text-[15px]">{content.problemStatement.description}</p>
          <div className="mt-6 space-y-4">
            {content.problemStatement.examples.map((example, idx) => (
              <div key={idx} className="rounded-xl bg-muted/50 border border-border overflow-hidden">
                <div className="px-4 py-2 bg-muted border-b border-border text-xs font-medium text-muted-foreground">
                  示例 {idx + 1}
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex items-start gap-2 text-sm">
                    <span className="text-violet-600 font-medium whitespace-nowrap">输入：</span>
                    <code className="text-emerald-700 font-mono text-xs bg-white px-2 py-0.5 rounded border">{example.input}</code>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <span className="text-emerald-600 font-medium whitespace-nowrap">输出：</span>
                    <code className="text-emerald-700 font-mono text-xs bg-white px-2 py-0.5 rounded border">{example.output}</code>
                  </div>
                  <div className="flex items-start gap-2 text-sm pt-1">
                    <span className="text-muted-foreground font-medium whitespace-nowrap">解释：</span>
                    <span className="text-foreground/80">{example.explanation}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-violet-200 shadow-lg shadow-violet-100">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">解题方法</h2>
              <p className="text-sm text-muted-foreground mt-0.5">选择一种解法查看详细步骤</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="px-6 pt-2 pb-4 border-b border-border">
            <div className="flex flex-wrap gap-2">
              {content.solutions.map((solution, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSolution(idx)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${activeSolution === idx ? 'bg-violet-600 text-white shadow-lg shadow-violet-200' : 'bg-muted text-muted-foreground hover:bg-muted/70 hover:text-foreground'}`}
                >
                  <span className="mr-2">{solution.icon}</span>
                  {solution.name}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeSolution}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="p-6 space-y-6"
            >
              <div className="p-5 rounded-xl bg-gradient-to-r from-violet-50 to-transparent border border-violet-200">
                <p className="text-foreground/80 leading-relaxed">{currentSolution.description}</p>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">解题步骤</h3>
                {currentSolution.steps.map((step, idx) => (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group"
                  >
                    <button
                      onClick={() => toggleStep(step.step)}
                      className="w-full flex items-start gap-4 p-4 rounded-xl bg-muted/50 border border-border hover:border-violet-300 transition-colors text-left"
                    >
                      <StepNumber number={step.step} active={expandedSteps.has(step.step)} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-foreground">{step.title}</h4>
                          <ChevronDown className={`w-4 h-4 text-muted-foreground/70 transition-transform duration-200 ${expandedSteps.has(step.step) ? 'rotate-180' : ''}`} />
                        </div>
                        <AnimatePresence>
                          {expandedSteps.has(step.step) && (
                            <motion.p
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-2 text-sm text-muted-foreground leading-relaxed"
                            >
                              {step.description}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    </button>
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs text-muted-foreground">时间复杂度</span>
                  </div>
                  <p className="text-lg font-mono font-semibold text-emerald-700">{currentSolution.complexity.time}</p>
                </div>
                <div className="p-4 rounded-xl bg-violet-50 border border-violet-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="w-4 h-4 text-violet-600" />
                    <span className="text-xs text-muted-foreground">空间复杂度</span>
                  </div>
                  <p className="text-lg font-mono font-semibold text-violet-700">{currentSolution.complexity.space}</p>
                </div>
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-amber-600" />
                    <span className="text-xs text-muted-foreground">适用场景</span>
                  </div>
                  <p className="text-sm text-foreground/80 leading-snug">{currentSolution.complexity.suitableFor}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="font-medium text-emerald-700">优点</span>
                  </div>
                  <ul className="space-y-2">
                    {currentSolution.complexity.pros.map((pro, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                        <span className="text-emerald-600 mt-0.5">+</span>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
                  <div className="flex items-center gap-2 mb-3">
                    <XCircle className="w-4 h-4 text-rose-600" />
                    <span className="font-medium text-rose-700">缺点</span>
                  </div>
                  <ul className="space-y-2">
                    {currentSolution.complexity.cons.map((con, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                        <span className="text-rose-600 mt-0.5">-</span>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <Code2 className="w-4 h-4" />
                    代码实现
                  </h3>
                  <Badge variant="secondary" className="bg-violet-100 text-violet-700 hover:bg-violet-100">Go</Badge>
                </div>
                <div className="rounded-xl overflow-hidden bg-card border border-border">
                  <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border">
                    <div className="w-3 h-3 rounded-full bg-rose-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  </div>
                  <pre className="p-4 overflow-x-auto">
                    <code className="text-[13px] font-mono text-muted-foreground leading-relaxed">
                      {currentSolution.code}
                    </code>
                  </pre>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <Table2 className="w-5 h-5 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">解法对比</h2>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-border">
                  {content.comparisonTable.headers.map((header, idx) => (
                    <th key={idx} className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {content.comparisonTable.rows.map((row, idx) => (
                  <tr key={idx} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                    <td className="py-4 px-4 font-medium text-foreground">{row.method}</td>
                    <td className="py-4 px-4">
                      <Badge variant="outline" className="border-amber-300 text-amber-700 bg-amber-50">{row.timeComplexity}</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="outline" className="border-violet-300 text-violet-700 bg-violet-50">{row.spaceComplexity}</Badge>
                    </td>
                    <td className="py-4 px-4 text-sm text-emerald-600">{row.pros}</td>
                    <td className="py-4 px-4 text-sm text-rose-600">{row.cons}</td>
                    <td className="py-4 px-4 text-sm text-foreground/80">{row.suitable}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="border-violet-200 shadow-lg shadow-violet-100">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
              <Zap className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">模式总结</h2>
              <p className="text-sm text-muted-foreground mt-0.5">掌握这类问题的通用思路</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-violet-700 mb-2">{content.patternSummary.patternName}</h3>
            <p className="text-foreground/80 leading-relaxed">{content.patternSummary.description}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">通用思路</h4>
            <div className="space-y-3">
              {content.patternSummary.generalApproach.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-start gap-4 p-4 rounded-xl bg-muted/50 border border-border"
                >
                  <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                    <ArrowRight className="w-4 h-4 text-violet-600" />
                  </div>
                  <p className="text-foreground/80 text-sm leading-relaxed pt-1.5">{step}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">类似题目</h4>
            <div className="flex flex-wrap gap-2">
              {content.patternSummary.relatedProblems.map((problem, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-full bg-muted border border-border text-sm text-foreground/80 hover:bg-violet-50 hover:border-violet-200 hover:text-violet-700 transition-colors cursor-pointer"
                >
                  {problem}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
