import React from 'react';
import { ConfigProvider } from 'antd';
import { HelmetProvider } from 'react-helmet-async';
import enUS from 'antd/lib/locale/en_US';
import zhCN from 'antd/lib/locale/zh_CN';
import GlobalStyle from './styles/GlobalStyle';
import 'typeface-montserrat';
import 'typeface-lato';
import { AppRouter } from './components/router/AppRouter';
import { useLanguage } from './hooks/useLanguage';
import { useAutoNightMode } from './hooks/useAutoNightMode';
import { usePWA } from './hooks/usePWA';
import { useThemeWatcher } from './hooks/useThemeWatcher';
import { useAppSelector } from './hooks/reduxHooks';
import { themeObject } from './styles/themes/themeVariables';

const App: React.FC = () => {
  const { language } = useLanguage();
  const theme = useAppSelector((state) => state.theme.theme);

  usePWA();

  useAutoNightMode();

  useThemeWatcher();

  // 根据语言选择对应的 Ant Design locale
  const getAntdLocale = () => {
    switch (language) {
      case 'zh':
        return zhCN;
      case 'en':
        return enUS;
      default:
        return zhCN;
    }
  };

  return (
    <>
      <meta name="theme-color" content={themeObject[theme].primary} />
      <GlobalStyle />
      <HelmetProvider>
        <ConfigProvider locale={getAntdLocale()}>
          <AppRouter />
        </ConfigProvider>
      </HelmetProvider>
    </>
  );
};

export default App;
