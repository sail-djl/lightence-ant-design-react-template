import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// no lazy loading for auth pages to avoid flickering
const AuthLayout = React.lazy(() => import('@app/components/layouts/AuthLayout/AuthLayout'));
import LoginPage from '@app/pages/LoginPage';
import SignUpPage from '@app/pages/SignUpPage';
import ForgotPasswordPage from '@app/pages/ForgotPasswordPage';
import SecurityCodePage from '@app/pages/SecurityCodePage';
import NewPasswordPage from '@app/pages/NewPasswordPage';
import LockPage from '@app/pages/LockPage';

import MainLayout from '@app/components/layouts/main/MainLayout/MainLayout';
import ProfileLayout from '@app/components/profile/ProfileLayout';
import RequireAuth from '@app/components/router/RequireAuth';
import { withLoading } from '@app/hocs/withLoading.hoc';
import DashboardPage from '@app/pages/dashboard/DashboardPage';
import IndexDashboardPage from '@app/pages/index/IndexDashboardPage';

const NewsFeedPage = React.lazy(() => import('@app/pages/NewsFeedPage'));
const DataTablesPage = React.lazy(() => import('@app/pages/DataTablesPage'));
const ChartsPage = React.lazy(() => import('@app/pages/ChartsPage'));
const KlinePage = React.lazy(() => import('@app/pages/trading/KlinePage'));
const PortfolioPage = React.lazy(() => import('@app/pages/trading/PortfolioPage'));
const PolarizationModelPage = React.lazy(() => import('@app/pages/model/PolarizationModelPage'));
const MarketOverviewPage = React.lazy(() => import('@app/pages/market/MarketOverviewPage'));
const MarketRatesPage = React.lazy(() => import('@app/pages/market/RatesPage'));
const MarketLiquidityPage = React.lazy(() => import('@app/pages/market/LiquidityPage'));
const MarketForexPage = React.lazy(() => import('@app/pages/market/ForexPage'));
const MarketInflationPage = React.lazy(() => import('@app/pages/market/InflationPage'));
const MarketRiskPage = React.lazy(() => import('@app/pages/market/RiskPage'));
const MarketStructurePage = React.lazy(() => import('@app/pages/market/StructurePage'));
const ServerErrorPage = React.lazy(() => import('@app/pages/ServerErrorPage'));
const Error404Page = React.lazy(() => import('@app/pages/Error404Page'));
const AdvancedFormsPage = React.lazy(() => import('@app/pages/AdvancedFormsPage'));
const PersonalInfoPage = React.lazy(() => import('@app/pages/profile/PersonalInfoPage'));
const SecuritySettingsPage = React.lazy(() => import('@app/pages/profile/SecuritySettingsPage'));
const NotificationsPage = React.lazy(() => import('@app/pages/profile/NotificationsPage'));
const PaymentsPage = React.lazy(() => import('@app/pages/profile/PaymentsPage'));
const UserManagementPage = React.lazy(() => import('@app/pages/system/UserManagementPage'));
const MenuManagementPage = React.lazy(() => import('@app/pages/system/MenuManagementPage'));
const RoleManagementPage = React.lazy(() => import('@app/pages/system/RoleManagementPage'));
const ButtonsPage = React.lazy(() => import('@app/pages/uiComponentsPages/ButtonsPage'));
const SpinnersPage = React.lazy(() => import('@app/pages/uiComponentsPages/SpinnersPage'));
const AvatarsPage = React.lazy(() => import('@app/pages/uiComponentsPages/dataDisplay/AvatarsPage'));
const BadgesPage = React.lazy(() => import('@app/pages/uiComponentsPages/dataDisplay/BadgesPage'));
const CollapsePage = React.lazy(() => import('@app/pages/uiComponentsPages/dataDisplay/CollapsePage'));
const PaginationPage = React.lazy(() => import('@app/pages/uiComponentsPages/dataDisplay/PaginationPage'));
const ModalsPage = React.lazy(() => import('@app/pages/uiComponentsPages/modals/ModalsPage'));
const PopoversPage = React.lazy(() => import('@app/pages/uiComponentsPages/modals/PopoversPage'));
const PopconfirmsPage = React.lazy(() => import('@app/pages/uiComponentsPages/modals/PopconfirmsPage'));
const ProgressPage = React.lazy(() => import('@app/pages/uiComponentsPages/feedback/ProgressPage'));
const ResultsPage = React.lazy(() => import('@app/pages/uiComponentsPages/feedback/ResultsPage'));
const AlertsPage = React.lazy(() => import('@app/pages/uiComponentsPages/feedback/AlertsPage'));
const SkeletonsPage = React.lazy(() => import('@app/pages/uiComponentsPages/feedback/SkeletonsPage'));
const InputsPage = React.lazy(() => import('@app/pages/uiComponentsPages/forms/InputsPage'));
const CheckboxesPage = React.lazy(() => import('@app/pages/uiComponentsPages/forms/CheckboxesPage'));
const RadiosPage = React.lazy(() => import('@app/pages/uiComponentsPages/forms/RadiosPage'));
const SelectsPage = React.lazy(() => import('@app/pages/uiComponentsPages/forms/SelectsPage'));
const SwitchesPage = React.lazy(() => import('@app/pages/uiComponentsPages/forms/SwitchesPage'));
const UploadsPage = React.lazy(() => import('@app/pages/uiComponentsPages/forms/UploadsPage'));
const RatesPage = React.lazy(() => import('@app/pages/uiComponentsPages/forms/RatesPage'));
const AutoCompletesPage = React.lazy(() => import('@app/pages/uiComponentsPages/forms/AutoCompletesPage'));
const StepsPage = React.lazy(() => import('@app/pages/uiComponentsPages/forms/StepsPage'));
const DateTimePickersPage = React.lazy(() => import('@app/pages/uiComponentsPages/forms/DateTimePickersPage'));
const DropdownsPage = React.lazy(() => import('@app/pages/uiComponentsPages/DropdownsPage'));
const BreadcrumbsPage = React.lazy(() => import('@app/pages/uiComponentsPages/navigation/BreadcrumbsPage'));
const TabsPage = React.lazy(() => import('@app/pages/uiComponentsPages/navigation/TabsPage'));
const NotificationsUIPage = React.lazy(() => import('@app/pages/uiComponentsPages/feedback/NotificationsPage'));
const GoogleMaps = React.lazy(() => import('@app/pages/maps/GoogleMapsPage/GoogleMapsPage'));
const LeafletMaps = React.lazy(() => import('@app/pages/maps/LeafletMapsPage/LeafletMapsPage'));
const ReactSimpleMaps = React.lazy(() => import('@app/pages/maps/ReactSimpleMapsPage/ReactSimpleMapsPage'));
const PigeonsMaps = React.lazy(() => import('@app/pages/maps/PigeonsMapsPage/PigeonsMapsPage'));
const Logout = React.lazy(() => import('./Logout'));
const EtfListPage = React.lazy(() => import('@app/pages/datamarket/EtfListPage'));
const FundListPage = React.lazy(() => import('@app/pages/datamarket/FundListPage'));
const FundDetail = React.lazy(() => import('@app/pages/datamarket/FundDetail'));
const IndexListPage = React.lazy(() => import('@app/pages/datamarket/IndexListPage'));
const StockListPage = React.lazy(() => import('@app/pages/datamarket/StockListPage'));
const MacroListPage = React.lazy(() => import('@app/pages/datamarket/MacroListPage'));
const FuturesListPage = React.lazy(() => import('@app/pages/datamarket/FuturesListPage'));
const SpotListPage = React.lazy(() => import('@app/pages/datamarket/SpotListPage'));
const OptionListPage = React.lazy(() => import('@app/pages/datamarket/OptionListPage'));
const BondListPage = React.lazy(() => import('@app/pages/datamarket/BondListPage'));
const ForexListPage = React.lazy(() => import('@app/pages/datamarket/ForexListPage'));
const UsStockListPage = React.lazy(() => import('@app/pages/datamarket/UsStockListPage'));
const IndexDetailPage = React.lazy(() => import('@app/pages/index/IndexDetailPage'));
const UserConfigPage = React.lazy(() => import('@app/pages/userconfig/UserConfigPage'));
const MarketConfigPage = React.lazy(() => import('@app/pages/sysconfig/MarketConfigPage'));
const SystemConfigPage = React.lazy(() => import('@app/pages/sysconfig/SystemConfigPage'));
const WatchlistPage = React.lazy(() => import('@app/pages/profile/WatchlistPage'));

export const NFT_DASHBOARD_PATH = '/';
export const MEDICAL_DASHBOARD_PATH = '/medical-dashboard';

const Dashboard = withLoading(DashboardPage);
const NewsFeed = withLoading(NewsFeedPage);
const AdvancedForm = withLoading(AdvancedFormsPage);
const Kline = withLoading(KlinePage);
const Portfolio = withLoading(PortfolioPage);
const PolarizationModel = withLoading(PolarizationModelPage);
const MarketOverview = withLoading(MarketOverviewPage);
const MarketRates = withLoading(MarketRatesPage);
const MarketLiquidity = withLoading(MarketLiquidityPage);
const MarketForex = withLoading(MarketForexPage);
const MarketInflation = withLoading(MarketInflationPage);
const MarketRisk = withLoading(MarketRiskPage);
const MarketStructure = withLoading(MarketStructurePage);

// UI Components
const Buttons = withLoading(ButtonsPage);
const Spinners = withLoading(SpinnersPage);
const Inputs = withLoading(InputsPage);
const Checkboxes = withLoading(CheckboxesPage);
const Radios = withLoading(RadiosPage);
const Selects = withLoading(SelectsPage);
const Switches = withLoading(SwitchesPage);
const Uploads = withLoading(UploadsPage);
const Rates = withLoading(RatesPage);
const AutoCompletes = withLoading(AutoCompletesPage);
const Steps = withLoading(StepsPage);
const DateTimePickers = withLoading(DateTimePickersPage);
const Dropdowns = withLoading(DropdownsPage);
const Breadcrumbs = withLoading(BreadcrumbsPage);
const Tabs = withLoading(TabsPage);
const Avatars = withLoading(AvatarsPage);
const Badges = withLoading(BadgesPage);
const Collapse = withLoading(CollapsePage);
const Pagination = withLoading(PaginationPage);
const Modals = withLoading(ModalsPage);
const Popovers = withLoading(PopoversPage);
const Popconfirms = withLoading(PopconfirmsPage);
const Progress = withLoading(ProgressPage);
const Results = withLoading(ResultsPage);
const Alerts = withLoading(AlertsPage);
const NotificationsUI = withLoading(NotificationsUIPage);
const Skeletons = withLoading(SkeletonsPage);

const DataTables = withLoading(DataTablesPage);
const Charts = withLoading(ChartsPage);
const EtfList = withLoading(EtfListPage);
const FundList = withLoading(FundListPage);
const FundDetailPage = withLoading(FundDetail);
const IndexList = withLoading(IndexListPage);
const StockList = withLoading(StockListPage);
const MacroList = withLoading(MacroListPage);
const FuturesList = withLoading(FuturesListPage);
const SpotList = withLoading(SpotListPage);
const OptionList = withLoading(OptionListPage);
const BondList = withLoading(BondListPage);
const ForexList = withLoading(ForexListPage);
const UsStockList = withLoading(UsStockListPage);
const IndexDetail = withLoading(IndexDetailPage);
const UserConfig = withLoading(UserConfigPage);
const MarketConfig = withLoading(MarketConfigPage);
const SystemConfig = withLoading(SystemConfigPage);
const Watchlist = withLoading(WatchlistPage);

// Maps
const Google = withLoading(GoogleMaps);
const Leaflet = withLoading(LeafletMaps);
const ReactSimple = withLoading(ReactSimpleMaps);
const Pigeons = withLoading(PigeonsMaps);

const ServerError = withLoading(ServerErrorPage);
const Error404 = withLoading(Error404Page);

// Profile
const PersonalInfo = withLoading(PersonalInfoPage);
const SecuritySettings = withLoading(SecuritySettingsPage);
const Notifications = withLoading(NotificationsPage);
const Payments = withLoading(PaymentsPage);
const UserManagement = withLoading(UserManagementPage);
const MenuManagement = withLoading(MenuManagementPage);
const RoleManagement = withLoading(RoleManagementPage);

const AuthLayoutFallback = withLoading(AuthLayout);
const LogoutFallback = withLoading(Logout);

export const AppRouter: React.FC = () => {
  const protectedLayout = (
    <RequireAuth>
      <MainLayout />
    </RequireAuth>
  );

  return (
    // 前端路由 硬编码优势 
    <BrowserRouter>
      <Routes>
        <Route path={NFT_DASHBOARD_PATH} element={protectedLayout}>
          // 首页仪表盘，A股决策启动页
          <Route index element={<Dashboard />} />
          {/* // 医疗主题仪表盘
          <Route path={MEDICAL_DASHBOARD_PATH} element={<MedicalDashboard />} /> */}
          // 市场部分主路由
          <Route path="market">
            {/* 市场总览 */}
            <Route path="overview" element={<MarketOverview />} />
            {/* 默认跳转到总览（可选，如果不加则/market无页面） */}
            <Route index element={<MarketOverview />} />
            {/* 利率分项 */}
            <Route path="rates" element={<MarketRates />} />
            {/* 流动性分项  /market/liquidity */}
            <Route path="liquidity" element={<MarketLiquidity />} />
            {/* 外汇分项  /market/forex */}
            <Route path="forex" element={<MarketForex />} />
            {/* 通胀分项  /market/inflation */}
            <Route path="inflation" element={<MarketInflation />} />
            {/* 风险分项  /market/risk */}
            <Route path="risk" element={<MarketRisk />} />
            {/* 市场结构分项  /market/structure */}
            <Route path="structure" element={<MarketStructure />} />
          </Route>
          <Route path="trading">
            <Route path="kline" element={<Kline />} />
            <Route path="portfolio" element={<Portfolio />} />
          </Route>
          <Route path="model">
            <Route path="polarization" element={<PolarizationModel />} />
          </Route>
          <Route path="index">
            <Route path="dashboard" element={<IndexDashboardPage />} />
            <Route path="detail/:code" element={<IndexDetail />} />
          </Route>
          <Route path="apps">
            <Route path="feed" element={<NewsFeed />} />
          </Route>
          <Route path="forms">
            <Route path="advanced-forms" element={<AdvancedForm />} />
          </Route>
          <Route path="data-tables" element={<DataTables />} />
          <Route path="charts" element={<Charts />} />
          <Route path="datamarket">
            <Route path="etf" element={<EtfList />} />
            <Route path="fund" element={<FundList />} />
            <Route path="fund/:code" element={<FundDetailPage />} />
            <Route path="index" element={<IndexList />} />
            <Route path="stock" element={<StockList />} />
            <Route path="macro" element={<MacroList />} />
            <Route path="futures" element={<FuturesList />} />
            <Route path="spot" element={<SpotList />} />
            <Route path="option" element={<OptionList />} />
            <Route path="bond" element={<BondList />} />
            <Route path="forex" element={<ForexList />} />
            <Route path="us_stock" element={<UsStockList />} />
          </Route>
          <Route path="maps">
            <Route path="google-maps" element={<Google />} />
            <Route path="leaflet-maps" element={<Leaflet />} />
            <Route path="react-simple-maps" element={<ReactSimple />} />
            <Route path="pigeon-maps" element={<Pigeons />} />
          </Route>
          <Route path="userconfig">
            {/* 个人自选 /userconfig/watchlist */}
            <Route path="watchlist" element={<Watchlist />} />
            {/* 个人配置 /userconfig/config */}
            <Route path="config" element={<UserConfig />} />
          </Route>
          <Route path="server-error" element={<ServerError />} />
          <Route path="404" element={<Error404 />} />
          {/* 个人中心 /profile */}
          <Route path="profile" element={<ProfileLayout />}>
            {/* 个人中心 /profile/personal-info */}
            <Route path="personal-info" element={<PersonalInfo />} />
            {/* 个人中心 /profile/security-settings */}
            <Route path="security-settings" element={<SecuritySettings />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="payments" element={<Payments />} />
          </Route>
          <Route path="system">
            <Route path="users" element={<UserManagement />} />
            <Route path="menus" element={<MenuManagement />} />
            <Route path="roles" element={<RoleManagement />} />
          </Route>
          <Route path="sysconfig">
            {/* 市场配置 /sysconfig/market  */}
            <Route path="market" element={<MarketConfig />} />
            {/* 系统配置管理 /sysconfig/system  */}
            <Route path="base" element={<SystemConfig />} />
          </Route>
          <Route path="ui-components">
            <Route path="button" element={<Buttons />} />
            <Route path="spinner" element={<Spinners />} />
            <Route path="input" element={<Inputs />} />
            <Route path="checkbox" element={<Checkboxes />} />
            <Route path="radio" element={<Radios />} />
            <Route path="select" element={<Selects />} />
            <Route path="switch" element={<Switches />} />
            <Route path="upload" element={<Uploads />} />
            <Route path="rate" element={<Rates />} />
            <Route path="auto-complete" element={<AutoCompletes />} />
            <Route path="steps" element={<Steps />} />
            <Route path="date-time-picker" element={<DateTimePickers />} />
            <Route path="dropdown" element={<Dropdowns />} />
            <Route path="breadcrumbs" element={<Breadcrumbs />} />
            <Route path="tabs" element={<Tabs />} />
            <Route path="avatar" element={<Avatars />} />
            <Route path="badge" element={<Badges />} />
            <Route path="collapse" element={<Collapse />} />
            <Route path="pagination" element={<Pagination />} />
            <Route path="modal" element={<Modals />} />
            <Route path="popover" element={<Popovers />} />
            <Route path="popconfirm" element={<Popconfirms />} />
            <Route path="progress" element={<Progress />} />
            <Route path="result" element={<Results />} />
            <Route path="alert" element={<Alerts />} />
            <Route path="notification" element={<NotificationsUI />} />
            <Route path="skeleton" element={<Skeletons />} />
          </Route>
        </Route>
        <Route path="/auth" element={<AuthLayoutFallback />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="sign-up" element={<SignUpPage />} />
          <Route
            path="lock"
            element={
              <RequireAuth>
                <LockPage />
              </RequireAuth>
            }
          />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="security-code" element={<SecurityCodePage />} />
          <Route path="new-password" element={<NewPasswordPage />} />
        </Route>
        <Route path="/logout" element={<LogoutFallback />} />
      </Routes>
    </BrowserRouter>
  );
};
