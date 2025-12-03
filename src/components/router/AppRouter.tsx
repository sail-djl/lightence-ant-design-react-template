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
import MedicalDashboardPage from '@app/pages/DashboardPages/MedicalDashboardPage';
import FinanceDashboardPage from '@app/pages/DashboardPages/FinanceDashboardPage';
import IndexDashboardPage from '@app/pages/index/IndexDashboardPage';

const NewsFeedPage = React.lazy(() => import('@app/pages/NewsFeedPage'));
const DataTablesPage = React.lazy(() => import('@app/pages/DataTablesPage'));
const ChartsPage = React.lazy(() => import('@app/pages/ChartsPage'));
const KlinePage = React.lazy(() => import('@app/pages/trading/KlinePage'));
const PortfolioPage = React.lazy(() => import('@app/pages/trading/PortfolioPage'));
const PolarizationModelPage = React.lazy(() => import('@app/pages/model/PolarizationModelPage'));
const StockMarketPage = React.lazy(() => import('@app/pages/market/StockMarketPage'));
const CryptoMarketPage = React.lazy(() => import('@app/pages/market/CryptoMarketPage'));
const ForexMarketPage = React.lazy(() => import('@app/pages/market/ForexMarketPage'));
const ServerErrorPage = React.lazy(() => import('@app/pages/ServerErrorPage'));
const Error404Page = React.lazy(() => import('@app/pages/Error404Page'));
const AdvancedFormsPage = React.lazy(() => import('@app/pages/AdvancedFormsPage'));
const PersonalInfoPage = React.lazy(() => import('@app/pages/PersonalInfoPage'));
const SecuritySettingsPage = React.lazy(() => import('@app/pages/SecuritySettingsPage'));
const NotificationsPage = React.lazy(() => import('@app/pages/NotificationsPage'));
const PaymentsPage = React.lazy(() => import('@app/pages/PaymentsPage'));
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

export const NFT_DASHBOARD_PATH = '/';
export const MEDICAL_DASHBOARD_PATH = '/medical-dashboard';

const MedicalDashboard = withLoading(MedicalDashboardPage);
const FinanceDashboard = withLoading(FinanceDashboardPage);
const NewsFeed = withLoading(NewsFeedPage);
const AdvancedForm = withLoading(AdvancedFormsPage);
const Kline = withLoading(KlinePage);
const Portfolio = withLoading(PortfolioPage);
const PolarizationModel = withLoading(PolarizationModelPage);
const StockMarket = withLoading(StockMarketPage);
const CryptoMarket = withLoading(CryptoMarketPage);
const ForexMarket = withLoading(ForexMarketPage);

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
    <BrowserRouter>
      <Routes>
        <Route path={NFT_DASHBOARD_PATH} element={protectedLayout}>
          <Route index element={<FinanceDashboard />} />
          <Route path={MEDICAL_DASHBOARD_PATH} element={<MedicalDashboard />} />
          <Route path="market">
            <Route path="stock" element={<StockMarket />} />
            <Route path="crypto" element={<CryptoMarket />} />
            <Route path="forex" element={<ForexMarket />} />
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
          </Route>
          <Route path="apps">
            <Route path="feed" element={<NewsFeed />} />
          </Route>
          <Route path="forms">
            <Route path="advanced-forms" element={<AdvancedForm />} />
          </Route>
          <Route path="data-tables" element={<DataTables />} />
          <Route path="charts" element={<Charts />} />
          <Route path="maps">
            <Route path="google-maps" element={<Google />} />
            <Route path="leaflet-maps" element={<Leaflet />} />
            <Route path="react-simple-maps" element={<ReactSimple />} />
            <Route path="pigeon-maps" element={<Pigeons />} />
          </Route>
          <Route path="server-error" element={<ServerError />} />
          <Route path="404" element={<Error404 />} />
          <Route path="profile" element={<ProfileLayout />}>
            <Route path="personal-info" element={<PersonalInfo />} />
            <Route path="security-settings" element={<SecuritySettings />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="payments" element={<Payments />} />
          </Route>
          <Route path="system">
            <Route path="users" element={<UserManagement />} />
            <Route path="menus" element={<MenuManagement />} />
            <Route path="roles" element={<RoleManagement />} />
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
