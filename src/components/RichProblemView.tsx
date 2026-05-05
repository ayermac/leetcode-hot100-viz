'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RichProblemContent } from '@/lib/data/richContentTypes';
import {
  BookOpen, Lightbulb, ShoppingCart, Code2, Table2,
  CheckCircle2, XCircle, Clock, Database, ArrowRight,
  ChevronDown, Sparkles, Target, Zap,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface RichProblemViewProps {
  content: RichProblemContent;
}

// Step number indicator component
const StepNumber = ({ number, active = false }: { number: number; active?: boolean }) => (
  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${active ? 'bg-violet-600 text-white dark:bg-violet-500' : 'bg-muted text-muted-foreground border border-border'}`}>
    {number}
  </div>
);

// Life scenario section
interface LifeScenarioCardProps {
  title: string;
  story: string;
  analogy: string;
}

const LifeScenarioCard = ({ title, story, analogy }: LifeScenarioCardProps) => (
  <Card className="border-violet-200 dark:border-violet-800 shadow-lg shadow-violet-100 dark:shadow-violet-900/20">
    <CardHeader className="pb-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900 flex items-center justify-center">
          <ShoppingCart className="w-5 h-5 text-violet-600 dark:text-violet-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground tracking-tight">{title}</h2>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-foreground/80 leading-relaxed text-[15px]">{story}</p>
      <div className="mt-5 p-4 rounded-xl bg-gradient-to-r from-violet-50 to-violet-100/50 dark:from-violet-950/50 dark:to-violet-900/30 border border-violet-200 dark:border-violet-800">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-violet-600 dark:text-violet-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-foreground/80">
            <span className="text-violet-700 dark:text-violet-300 font-medium">类比理解：</span>
            {analogy}
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Problem example component
interface ProblemExampleProps {
  index: number;
  input: string;
  output: string;
  explanation: string;
}

const ProblemExample = ({ index, input, output, explanation }: ProblemExampleProps) => (
  <div className="rounded-xl bg-muted/50 border border-border overflow-hidden">
    <div className="px-4 py-2 bg-muted border-b border-border text-xs font-medium text-muted-foreground">
      示例 {index + 1}
    </div>
    <div className="p-4 space-y-2">
      <div className="flex items-start gap-2 text-sm">
        <span className="text-violet-600 dark:text-violet-400 font-medium whitespace-nowrap">输入：</span>
        <code className="text-emerald-700 dark:text-emerald-400 font-mono text-xs bg-white dark:bg-gray-900 px-2 py-0.5 rounded border">{input}</code>
      </div>
      <div className="flex items-start gap-2 text-sm">
        <span className="text-emerald-600 dark:text-emerald-400 font-medium whitespace-nowrap">输出：</span>
        <code className="text-emerald-700 dark:text-emerald-400 font-mono text-xs bg-white dark:bg-gray-900 px-2 py-0.5 rounded border">{output}</code>
      </div>
      <div className="flex items-start gap-2 text-sm pt-1">
        <span className="text-muted-foreground font-medium whitespace-nowrap">解释：</span>
        <span className="text-foreground/80">{explanation}</span>
      </div>
    </div>
  </div>
);

// Problem statement section
interface ProblemStatementCardProps {
  description: string;
  examples: Array<{ input: string; output: string; explanation: string }>;
}

const ProblemStatementCard = ({ description, examples }: ProblemStatementCardProps) => (
  <Card>
    <CardHeader className="pb-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">问题描述</h2>
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-foreground/80 leading-relaxed text-[15px]">{description}</p>
      <div className="mt-6 space-y-4">
        {examples.map((example, idx) => (
          <ProblemExample key={idx} index={idx} {...example} />
        ))}
      </div>
    </CardContent>
  </Card>
);

// Expandable solution step
interface SolutionStepProps {
  step: number;
  title: string;
  description: string;
  isExpanded: boolean;
  onToggle: () => void;
}

const SolutionStep = ({ step, title, description, isExpanded, onToggle }: SolutionStepProps) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    className="group"
  >
    <button
      onClick={onToggle}
      aria-expanded={isExpanded}
      className="w-full flex items-start gap-4 p-4 rounded-xl bg-muted/50 border border-border hover:border-violet-300 dark:hover:border-violet-600 transition-colors text-left"
    >
      <StepNumber number={step} active={isExpanded} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-foreground">{title}</h4>
          <ChevronDown className={`w-4 h-4 text-muted-foreground/70 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
        </div>
        <AnimatePresence>
          {isExpanded && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 text-sm text-muted-foreground leading-relaxed"
            >
              {description}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </button>
  </motion.div>
);

// Complexity grid showing time/space complexity and suitable scenarios
interface ComplexityGridProps {
  time: string;
  space: string;
  suitableFor: string;
}

const ComplexityGrid = ({ time, space, suitableFor }: ComplexityGridProps) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
      <div className="flex items-center gap-2 mb-2">
        <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        <span className="text-xs text-muted-foreground">时间复杂度</span>
      </div>
      <p className="text-lg font-mono font-semibold text-emerald-700 dark:text-emerald-400">{time}</p>
    </div>
    <div className="p-4 rounded-xl bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800">
      <div className="flex items-center gap-2 mb-2">
        <Database className="w-4 h-4 text-violet-600 dark:text-violet-400" />
        <span className="text-xs text-muted-foreground">空间复杂度</span>
      </div>
      <p className="text-lg font-mono font-semibold text-violet-700 dark:text-violet-400">{space}</p>
    </div>
    <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
      <div className="flex items-center gap-2 mb-2">
        <Target className="w-4 h-4 text-amber-600 dark:text-amber-400" />
        <span className="text-xs text-muted-foreground">适用场景</span>
      </div>
      <p className="text-sm text-foreground/80 leading-snug">{suitableFor}</p>
    </div>
  </div>
);

// Pros and cons grid
interface ProsConsGridProps {
  pros: string[];
  cons: string[];
}

const ProsConsGrid = ({ pros, cons }: ProsConsGridProps) => (
  <div className="grid md:grid-cols-2 gap-4">
    <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
      <div className="flex items-center gap-2 mb-3">
        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        <span className="font-medium text-emerald-700 dark:text-emerald-400">优点</span>
      </div>
      <ul className="space-y-2">
        {pros.map((pro, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
            <span className="text-emerald-600 dark:text-emerald-400 mt-0.5">+</span>
            {pro}
          </li>
        ))}
      </ul>
    </div>
    <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800">
      <div className="flex items-center gap-2 mb-3">
        <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
        <span className="font-medium text-rose-700 dark:text-rose-400">缺点</span>
      </div>
      <ul className="space-y-2">
        {cons.map((con, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
            <span className="text-rose-600 dark:text-rose-400 mt-0.5">-</span>
            {con}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

// Code block component
interface CodeBlockProps {
  code: string;
}

const CodeBlock = ({ code }: CodeBlockProps) => (
  <div>
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
        <Code2 className="w-4 h-4" />
        代码实现
      </h3>
      <Badge variant="secondary" className="bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-900">Go</Badge>
    </div>
    <div className="rounded-xl overflow-hidden bg-card border border-border">
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border">
        <div className="w-3 h-3 rounded-full bg-rose-400" />
        <div className="w-3 h-3 rounded-full bg-amber-400" />
        <div className="w-3 h-3 rounded-full bg-emerald-400" />
      </div>
      <pre className="p-4 overflow-x-auto">
        <code className="text-[13px] font-mono text-muted-foreground leading-relaxed">
          {code}
        </code>
      </pre>
    </div>
  </div>
);

// Solution method card
interface SolutionMethodCardProps {
  solutions: RichProblemContent['solutions'];
  activeSolution: number;
  onSolutionChange: (idx: number) => void;
  expandedSteps: Set<number>;
  onToggleStep: (step: number) => void;
}

const SolutionMethodCard = ({ 
  solutions, 
  activeSolution, 
  onSolutionChange,
  expandedSteps,
  onToggleStep,
}: SolutionMethodCardProps) => {
  const currentSolution = solutions[activeSolution];

  return (
    <Card className="border-violet-200 dark:border-violet-800 shadow-lg shadow-violet-100 dark:shadow-violet-900/20">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400" />
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
            {solutions.map((solution, idx) => (
              <button
                key={idx}
                onClick={() => onSolutionChange(idx)}
                aria-pressed={activeSolution === idx}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${activeSolution === idx ? 'bg-violet-600 text-white shadow-lg shadow-violet-200 dark:shadow-violet-800' : 'bg-muted text-muted-foreground hover:bg-muted/70 hover:text-foreground'}`}
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
            <SolutionDescription description={currentSolution.description} />
            <SolutionSteps 
              steps={currentSolution.steps} 
              expandedSteps={expandedSteps}
              onToggleStep={onToggleStep}
            />
            <ComplexityGrid {...currentSolution.complexity} />
            <ProsConsGrid {...currentSolution.complexity} />
            <CodeBlock code={currentSolution.code} />
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

// Solution description inner component
const SolutionDescription = ({ description }: { description: string }) => (
  <div className="p-5 rounded-xl bg-gradient-to-r from-violet-50 to-transparent dark:from-violet-950/50 dark:to-transparent border border-violet-200 dark:border-violet-800">
    <p className="text-foreground/80 leading-relaxed">{description}</p>
  </div>
);

// Solution steps inner component
interface SolutionStepsProps {
  steps: RichProblemContent['solutions'][0]['steps'];
  expandedSteps: Set<number>;
  onToggleStep: (step: number) => void;
}

const SolutionSteps = ({ steps, expandedSteps, onToggleStep }: SolutionStepsProps) => (
  <div className="space-y-3">
    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">解题步骤</h3>
    {steps.map((step, idx) => (
      <SolutionStep
        key={step.step}
        step={step.step}
        title={step.title}
        description={step.description}
        isExpanded={expandedSteps.has(step.step)}
        onToggle={() => onToggleStep(step.step)}
      />
    ))}
  </div>
);

// Comparison table component
interface ComparisonTableProps {
  headers: string[];
  rows: RichProblemContent['comparisonTable']['rows'];
}

const ComparisonTable = ({ headers, rows }: ComparisonTableProps) => (
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
              {headers.map((header, idx) => (
                <th key={idx} scope="col" className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                <td className="py-4 px-4 font-medium text-foreground">{row.method}</td>
                <td className="py-4 px-4">
                  <Badge variant="outline" className="border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30">{row.timeComplexity}</Badge>
                </td>
                <td className="py-4 px-4">
                  <Badge variant="outline" className="border-violet-300 dark:border-violet-700 text-violet-700 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/30">{row.spaceComplexity}</Badge>
                </td>
                <td className="py-4 px-4 text-sm text-emerald-600 dark:text-emerald-400">{row.pros}</td>
                <td className="py-4 px-4 text-sm text-rose-600 dark:text-rose-400">{row.cons}</td>
                <td className="py-4 px-4 text-sm text-foreground/80">{row.suitable}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CardContent>
  </Card>
);

// Pattern summary card
interface PatternSummaryCardProps {
  patternSummary: RichProblemContent['patternSummary'];
}

const PatternSummaryCard = ({ patternSummary }: PatternSummaryCardProps) => (
  <Card className="border-violet-200 dark:border-violet-800 shadow-lg shadow-violet-100 dark:shadow-violet-900/20">
    <CardHeader className="pb-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900 flex items-center justify-center">
          <Zap className="w-5 h-5 text-violet-600 dark:text-violet-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">模式总结</h2>
          <p className="text-sm text-muted-foreground mt-0.5">掌握这类问题的通用思路</p>
        </div>
      </div>
    </CardHeader>
    <CardContent className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-violet-700 dark:text-violet-400 mb-2">{patternSummary.patternName}</h3>
        <p className="text-foreground/80 leading-relaxed">{patternSummary.description}</p>
      </div>

      <div>
        <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">通用思路</h4>
        <div className="space-y-3">
          {patternSummary.generalApproach.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-start gap-4 p-4 rounded-xl bg-muted/50 border border-border"
            >
              <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900 flex items-center justify-center flex-shrink-0">
                <ArrowRight className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              </div>
              <p className="text-foreground/80 text-sm leading-relaxed pt-1.5">{step}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">类似题目</h4>
        <div className="flex flex-wrap gap-2">
          {patternSummary.relatedProblems.map((problem, idx) => (
            <span
              key={idx}
              className="px-3 py-1.5 rounded-full bg-muted border border-border text-sm text-foreground/80 hover:bg-violet-50 dark:hover:bg-violet-950/30 hover:border-violet-200 dark:hover:border-violet-700 hover:text-violet-700 dark:hover:text-violet-300 transition-colors cursor-pointer"
            >
              {problem}
            </span>
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
);

// Main component - composes sub-components
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

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <LifeScenarioCard 
        title={content.lifeScenario.title}
        story={content.lifeScenario.story}
        analogy={content.lifeScenario.analogy}
      />
      <ProblemStatementCard 
        description={content.problemStatement.description}
        examples={content.problemStatement.examples}
      />
      <SolutionMethodCard 
        solutions={content.solutions}
        activeSolution={activeSolution}
        onSolutionChange={setActiveSolution}
        expandedSteps={expandedSteps}
        onToggleStep={toggleStep}
      />
      <ComparisonTable 
        headers={content.comparisonTable.headers}
        rows={content.comparisonTable.rows}
      />
      <PatternSummaryCard patternSummary={content.patternSummary} />
    </div>
  );
}
