/**
 * Type definitions for rich problem content (AI-generated educational content)
 */

export interface SolutionStep {
  step: number;
  title: string;
  description: string;
}

export interface ComplexityInfo {
  time: string;
  space: string;
  pros: string[];
  cons: string[];
  suitableFor: string;
}

export interface SolutionMethod {
  name: string;
  nameEn: string;
  icon: string;
  description: string;
  steps: SolutionStep[];
  complexity: ComplexityInfo;
  code: string;
}

export interface ComparisonRow {
  method: string;
  timeComplexity: string;
  spaceComplexity: string;
  pros: string;
  cons: string;
  suitable: string;
}

export interface ExampleRunStep {
  step: number;
  [key: string]: string | number;
}

export interface ExampleRun {
  methodName: string;
  steps: ExampleRunStep[];
}

export interface PatternSummary {
  patternName: string;
  description: string;
  generalApproach: string[];
  relatedProblems: string[];
}

export interface RichProblemContent {
  id: string;
  title: string;
  slug: string;
  lifeScenario: {
    title: string;
    icon: string;
    story: string;
    analogy: string;
  };
  problemStatement: {
    description: string;
    examples: Array<{
      input: string;
      output: string;
      explanation: string;
    }>;
  };
  solutions: SolutionMethod[];
  comparisonTable: {
    headers: string[];
    rows: ComparisonRow[];
  };
  exampleRuns: ExampleRun[];
  patternSummary: PatternSummary;
}
