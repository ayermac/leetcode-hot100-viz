'use client';

import { Button } from '@/components/ui/button';
import { Language } from '@/hooks/useLanguagePreference';

interface LanguageSelectorProps {
  availableLanguages: Language[];
  selectedLanguage: Language;
  onLanguageChange: (lang: Language) => void;
}

const LANGUAGE_LABELS: Record<Language, string> = {
  go: 'Go',
  python: 'Python',
  java: 'Java',
};

export function LanguageSelector({
  availableLanguages,
  selectedLanguage,
  onLanguageChange,
}: LanguageSelectorProps) {
  const languages: Language[] = ['go', 'python', 'java'];

  return (
    <div className="flex gap-1">
      {languages.map((lang) => {
        const isAvailable = availableLanguages.includes(lang);
        const isSelected = selectedLanguage === lang;

        return (
          <Button
            key={lang}
            variant={isSelected ? 'default' : isAvailable ? 'outline' : 'ghost'}
            size="sm"
            disabled={!isAvailable}
            onClick={() => onLanguageChange(lang)}
            title={!isAvailable ? '该语言暂无代码' : undefined}
            className="text-xs"
          >
            {LANGUAGE_LABELS[lang]}
          </Button>
        );
      })}
    </div>
  );
}