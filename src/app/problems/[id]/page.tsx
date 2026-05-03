import { getProblemById, getCategoryById, getProblems } from '@/lib/data/loader';
import { renderMarkdown } from '@/lib/mdx';
import { ProblemHeader } from '@/components/ProblemHeader';
import { ProblemPageClient } from './ProblemPageClient';

interface ProblemPageProps {
  params: Promise<{
    id: string;
  }>;
}

export function generateStaticParams() {
  const problems = getProblems();
  return problems.map((problem) => ({
    id: problem.id,
  }));
}

export default async function ProblemPage({ params }: ProblemPageProps) {
  const { id } = await params;
  const problem = getProblemById(id);

  if (!problem) {
    return (
      <div className="container py-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">题目不存在</h1>
          <p className="text-muted-foreground">找不到该题目，请返回首页重新选择。</p>
        </div>
      </div>
    );
  }

  const category = getCategoryById(problem.categoryId);

  if (!category) {
    return (
      <div className="container py-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">分类不存在</h1>
          <p className="text-muted-foreground">找不到该题目所属分类。</p>
        </div>
      </div>
    );
  }

  // Pre-render markdown on server
  const descriptionHtml = await renderMarkdown(problem.description);
  const lifeScenarioHtml = problem.lifeScenario ? await renderMarkdown(problem.lifeScenario) : null;
  const thoughtProcessHtml = problem.thoughtProcess ? await renderMarkdown(problem.thoughtProcess) : null;
  const codeExplanationHtml = problem.codeExplanation ? await renderMarkdown(problem.codeExplanation) : null;
  const pitfallsHtml = problem.pitfalls ? await renderMarkdown(problem.pitfalls) : null;
  const extensionsHtml = problem.extensions ? await renderMarkdown(problem.extensions) : null;
  const tipsHtml = problem.tips ? await renderMarkdown(problem.tips) : null;

  return (
    <div className="container py-6">
      <ProblemHeader problem={problem} category={category} />
      <ProblemPageClient
        problem={problem}
        descriptionHtml={descriptionHtml}
        lifeScenarioHtml={lifeScenarioHtml}
        thoughtProcessHtml={thoughtProcessHtml}
        codeExplanationHtml={codeExplanationHtml}
        pitfallsHtml={pitfallsHtml}
        extensionsHtml={extensionsHtml}
        tipsHtml={tipsHtml}
      />
    </div>
  );
}
