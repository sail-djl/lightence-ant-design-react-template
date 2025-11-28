import { Dates } from '@app/constants/Dates';
import { LanguageType } from '@app/interfaces/interfaces';
import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const localLanguage = (localStorage.getItem('lng') as LanguageType) || 'zh';

export const useLanguage = (): { language: LanguageType; setLanguage: (locale: LanguageType) => Promise<void> } => {
  const { i18n } = useTranslation();

  const handleChangeLanguage = useCallback(
    async (locale: LanguageType) => {
      // dayjs 使用 'zh-cn' 作为中文 locale
      const dayjsLocale = locale === 'zh' ? 'zh-cn' : locale;
      Dates.setLocale(dayjsLocale);
      localStorage.setItem('lng', locale);
      await i18n.changeLanguage(locale);
    },
    [i18n],
  );

  useEffect(() => {
    localLanguage && handleChangeLanguage(localLanguage);
  }, [handleChangeLanguage]);

  return useMemo(
    () => ({ language: i18n.language as LanguageType, setLanguage: handleChangeLanguage }),
    [handleChangeLanguage, i18n.language],
  );
};
