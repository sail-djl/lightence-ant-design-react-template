import { LanguageType } from '@app/interfaces/interfaces';

interface Language {
  id: number;
  name: LanguageType;
  title: string;
  countryCode: string;
}

export const languages: Language[] = [
  {
    id: 1,
    name: 'zh',
    title: '中文',
    countryCode: 'cn',
  },
  {
    id: 2,
    name: 'en',
    title: 'English',
    countryCode: 'gb',
  },
];
