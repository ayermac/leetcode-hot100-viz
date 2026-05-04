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

interface RichProblemViewProps {
  content: RichProblemContent;
}

// Design System Components
const Card = ({ children, className = '', glow = false }: { children: React.ReactNode; className?: string; glow?: boolean }) => (
  <div className={`relative bg-[#0a0a0c] border border-white/[0.08] rounded-2xl overflow-hidden ${glow ? 'shadow-[0_0_30px_rgba(94,106,210,0.1)]' : ''} ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, icon: Icon, title, subtitle }: { children?: React.ReactNode; icon?: React.ComponentType<{ className?: string }>; title: string; subtitle?: string }) => (
  <div className="px-6 py-5 border-b border-white/[0.06]">
    <div className="flex items-center gap-3">
      {Icon && (
        <div className="w-10 h-10 rounded-xl bg-[#5E6AD2]/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-[#5E6AD2]" />
        </div>
      )}
      <div>
        <h2 className="text-lg font-semibold text-[#EDEDEF] tracking-tight">{title}</h2>
        {subtitle && <p className="text-sm text-[#8A8F98] mt-0.5">{subtitle}</p>}
      </div>
    </div>
    {children}
  </div>
);

const CardContent = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

const Badge = ({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'success' | 'warning' | 'indigo' }) => {
  const variants = {
    default: 'bg-white/[0.06] text-[#8A8F98] border-white/[0.08]',
    success: 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20',
    warning: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',
    indigo: 'bg-[#5E6AD2]/10 text-[#5E6AD2] border-[#5E6AD2]/20',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant]}`}>
      {children}
    </span>
  );
};

const StepNumber = ({ number, active = false }: { number: number; active?: boolean }) => (
  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${active ? 'bg-[#5E6AD2] text-white' : 'bg-white/[0.06] text-[#8A8F98] border border-white/[0.08]'}`}>
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
    <div className="space-y-6 pb-12">
      <Card glow>
        <CardHeader icon={ShoppingCart} title={content.lifeScenario.title} />
        <CardContent>
          <p className="text-[#EDEDEF] leading-relaxed text-[15px]">{content.lifeScenario.story}</p>
          <div className="mt-5 p-4 rounded-xl bg-gradient-to-r from-[#5E6AD2]/10 to-[#5E6AD2]/5 border border-[#5E6AD2]/20">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-[#5E6AD2] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[#EDEDEF]">
                <span className="text-[#5E6AD2] font-medium">类比理解：</span>
                {content.lifeScenario.analogy}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader icon={BookOpen} title="问题描述" />
        <CardContent>
          <p className="text-[#EDEDEF] leading-relaxed text-[15px]">{content.problemStatement.description}</p>
          <div className="mt-6 space-y-4">
            {content.problemStatement.examples.map((example, idx) => (
              <div key={idx} className="rounded-xl bg-[#050506] border border-white/[0.06] overflow-hidden">
                <div className="px-4 py-2 bg-white/[0.03] border-b border-white/[0.06] text-xs font-medium text-[#8A8F98]">
                  示例 {idx + 1}
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex items-start gap-2 text-sm">
                    <span className="text-[#5E6AD2] font-medium whitespace-nowrap">输入：</span>
                    <code className="text-[#C3E88D] font-mono text-xs">{example.input}</code>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <span className="text-[#22C55E] font-medium whitespace-nowrap">输出：</span>
                    <code className="text-[#22C55E] font-mono text-xs">{example.output}</code>
                  </div>
                  <div className="flex items-start gap-2 text-sm pt-1">
                    <span className="text-[#8A8F98] font-medium whitespace-nowrap">解释：</span>
                    <span className="text-[#EDEDEF]">{example.explanation}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card glow>
        <CardHeader icon={Lightbulb} title="解题方法" subtitle="选择一种解法查看详细步骤" />
        <CardContent className="p-0">
          <div className="px-6 pt-2 pb-4 border-b border-white/[0.06]">
            <div className="flex flex-wrap gap-2">
              {content.solutions.map((solution, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSolution(idx)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${activeSolution === idx ? 'bg-[#5E6AD2] text-white shadow-lg shadow-[#5E6AD2]/25' : 'bg-white/[0.04] text-[#8A8F98] hover:bg-white/[0.08] hover:text-[#EDEDEF]'}`}
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
              <div className="p-5 rounded-xl bg-gradient-to-r from-[#5E6AD2]/10 to-transparent border border-[#5E6AD2]/20">
                <p className="text-[#EDEDEF] leading-relaxed">{currentSolution.description}</p>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-medium text-[#8A8F98] uppercase tracking-wider">解题步骤</h3>
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
                      className="w-full flex items-start gap-4 p-4 rounded-xl bg-[#050506] border border-white/[0.06] hover:border-[#5E6AD2]/30 transition-colors text-left"
                    >
                      <StepNumber number={step.step} active={expandedSteps.has(step.step)} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-[#EDEDEF]">{step.title}</h4>
                          <ChevronDown className={`w-4 h-4 text-[#8A8F98] transition-transform duration-200 ${expandedSteps.has(step.step) ? 'rotate-180' : ''}`} />
                        </div>
                        <AnimatePresence>
                          {expandedSteps.has(step.step) && (
                            <motion.p
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-2 text-sm text-[#8A8F98] leading-relaxed"
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

              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[#22C55E]/5 border border-[#22C55E]/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-[#22C55E]" />
                    <span className="text-xs text-[#8A8F98]">时间复杂度</span>
                  </div>
                  <p className="text-lg font-mono font-semibold text-[#22C55E]">{currentSolution.complexity.time}</p>
                </div>
                <div className="p-4 rounded-xl bg-[#5E6AD2]/5 border border-[#5E6AD2]/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="w-4 h-4 text-[#5E6AD2]" />
                    <span className="text-xs text-[#8A8F98]">空间复杂度</span>
                  </div>
                  <p className="text-lg font-mono font-semibold text-[#5E6AD2]">{currentSolution.complexity.space}</p>
                </div>
                <div className="p-4 rounded-xl bg-[#F59E0B]/5 border border-[#F59E0B]/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-[#F59E0B]" />
                    <span className="text-xs text-[#8A8F98]">适用场景</span>
                  </div>
                  <p className="text-sm text-[#EDEDEF] leading-snug">{currentSolution.complexity.suitableFor}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#22C55E]/5 border border-[#22C55E]/20">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                    <span className="font-medium text-[#22C55E]">优点</span>
                  </div>
                  <ul className="space-y-2">
                    {currentSolution.complexity.pros.map((pro, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[#EDEDEF]">
                        <span className="text-[#22C55E] mt-0.5">+</span>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 rounded-xl bg-[#F43F5E]/5 border border-[#F43F5E]/20">
                  <div className="flex items-center gap-2 mb-3">
                    <XCircle className="w-4 h-4 text-[#F43F5E]" />
                    <span className="font-medium text-[#F43F5E]">缺点</span>
                  </div>
                  <ul className="space-y-2">
                    {currentSolution.complexity.cons.map((con, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[#EDEDEF]">
                        <span className="text-[#F43F5E] mt-0.5">-</span>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-[#8A8F98] uppercase tracking-wider flex items-center gap-2">
                    <Code2 className="w-4 h-4" />
                    代码实现
                  </h3>
                  <Badge variant="indigo">Go</Badge>
                </div>
                <div className="rounded-xl overflow-hidden bg-[#0E1016] border border-white/[0.08]">
                  <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/[0.06]">
                    <div className="w-3 h-3 rounded-full bg-[#F43F5E]/80" />
                    <div className="w-3 h-3 rounded-full bg-[#F59E0B]/80" />
                    <div className="w-3 h-3 rounded-full bg-[#22C55E]/80" />
                  </div>
                  <pre className="p-4 overflow-x-auto">
                    <code className="text-[13px] font-mono text-[#EDEDEF] leading-relaxed">
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
        <CardHeader icon={Table2} title="解法对比" />
        <CardContent>
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {content.comparisonTable.headers.map((header, idx) => (
                    <th key={idx} className="text-left py-3 px-4 text-sm font-medium text-[#8A8F98]">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {content.comparisonTable.rows.map((row, idx) => (
                  <tr key={idx} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-4 font-medium text-[#EDEDEF]">{row.method}</td>
                    <td className="py-4 px-4">
                      <Badge variant="warning">{row.timeComplexity}</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="indigo">{row.spaceComplexity}</Badge>
                    </td>
                    <td className="py-4 px-4 text-sm text-[#22C55E]">{row.pros}</td>
                    <td className="py-4 px-4 text-sm text-[#F43F5E]">{row.cons}</td>
                    <td className="py-4 px-4 text-sm text-[#EDEDEF]">{row.suitable}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card glow>
        <CardHeader icon={Zap} title="模式总结" subtitle="掌握这类问题的通用思路" />
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-[#5E6AD2] mb-2">{content.patternSummary.patternName}</h3>
            <p className="text-[#EDEDEF] leading-relaxed">{content.patternSummary.description}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-[#8A8F98] uppercase tracking-wider mb-4">通用思路</h4>
            <div className="space-y-3">
              {content.patternSummary.generalApproach.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-start gap-4 p-4 rounded-xl bg-[#050506] border border-white/[0.06]"
                >
                  <div className="w-8 h-8 rounded-full bg-[#5E6AD2]/10 flex items-center justify-center flex-shrink-0">
                    <ArrowRight className="w-4 h-4 text-[#5E6AD2]" />
                  </div>
                  <p className="text-[#EDEDEF] text-sm leading-relaxed pt-1.5">{step}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-[#8A8F98] uppercase tracking-wider mb-4">类似题目</h4>
            <div className="flex flex-wrap gap-2">
              {content.patternSummary.relatedProblems.map((problem, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-sm text-[#EDEDEF] hover:bg-[#5E6AD2]/10 hover:border-[#5E6AD2]/30 transition-colors cursor-pointer"
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
