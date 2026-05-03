'use client';

import { Solution } from '@/lib/data/types';
import { useLanguagePreference } from '@/hooks/useLanguagePreference';
import { SolutionTabs } from '@/components/SolutionTabs';

interface SolutionTabsClientProps {
  solutions: Solution[];
}

export function SolutionTabsClient({ solutions }: SolutionTabsClientProps) {
  const { language, setLanguage } = useLanguagePreference();

  return (
    <SolutionTabs
      solutions={solutions}
      selectedLanguage={language}
      onLanguageChange={setLanguage}
    />
  );
}