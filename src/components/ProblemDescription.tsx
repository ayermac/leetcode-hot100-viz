interface ProblemDescriptionProps {
  description: string;
  lifeScenario?: string;
}

export function ProblemDescription({ description, lifeScenario }: ProblemDescriptionProps) {
  return (
    <div className="space-y-6">
      <div
        className="prose prose-sm dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: description }}
      />
      {lifeScenario && (
        <div>
          <h2 className="text-lg font-semibold mb-3">生活场景</h2>
          <div
            className="prose prose-sm dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: lifeScenario }}
          />
        </div>
      )}
    </div>
  );
}