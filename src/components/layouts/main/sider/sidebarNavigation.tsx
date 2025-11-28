import React from 'react';
import {
  CompassOutlined,
  DashboardOutlined,
  FormOutlined,
  HomeOutlined,
  LayoutOutlined,
  LineChartOutlined,
  TableOutlined,
  UserOutlined,
  BlockOutlined,
} from '@ant-design/icons';
import { ReactComponent as NftIcon } from '@app/assets/icons/nft-icon.svg';

export interface SidebarNavigationItem {
  title: string;
  key: string;
  url?: string;
  children?: SidebarNavigationItem[];
  icon?: React.ReactNode;
}

export const sidebarNavigation: SidebarNavigationItem[] = [
  {
    title: 'common.finance-dashboard',
    key: 'finance-dashboard',
    url: '/',
    icon: <LineChartOutlined />,
  },
  {
    title: 'common.market',
    key: 'market',
    icon: <DashboardOutlined />,
    children: [
      {
        title: 'common.stock-market',
        key: 'stock-market',
        url: '/market/stock',
      },
      {
        title: 'common.crypto-market',
        key: 'crypto-market',
        url: '/market/crypto',
      },
      {
        title: 'common.forex-market',
        key: 'forex-market',
        url: '/market/forex',
      },
    ],
  },
  {
    title: 'common.trading',
    key: 'trading',
    icon: <LineChartOutlined />,
    children: [
      {
        title: 'common.kline',
        key: 'kline',
        url: '/trading/kline',
      },
      {
        title: 'common.portfolio',
        key: 'portfolio',
        url: '/trading/portfolio',
      },
    ],
  },
  // 医疗仪表盘 - 金融项目不需要
  // {
  //   title: 'common.medical-dashboard',
  //   key: 'medical-dashboard',
  //   url: '/medical-dashboard',
  //   icon: <DashboardOutlined />,
  // },
  // 应用 - 金融项目不需要
  // {
  //   title: 'common.apps',
  //   key: 'apps',
  //   icon: <HomeOutlined />,
  //   children: [
  //     {
  //       title: 'common.feed',
  //       key: 'feed',
  //       url: '/apps/feed',
  //     },
  //   ],
  // },
  // 认证页面 - 保留登录等功能，但不在菜单显示
  // {
  //   title: 'common.authPages',
  //   key: 'auth',
  //   icon: <UserOutlined />,
  //   children: [
  //     {
  //       title: 'common.login',
  //       key: 'login',
  //       url: '/auth/login',
  //     },
  //     {
  //       title: 'common.signUp',
  //       key: 'singUp',
  //       url: '/auth/sign-up',
  //     },
  //     {
  //       title: 'common.lock',
  //       key: 'lock',
  //       url: '/auth/lock',
  //     },
  //     {
  //       title: 'common.forgotPass',
  //       key: 'forgotPass',
  //       url: '/auth/forgot-password',
  //     },
  //     {
  //       title: 'common.securityCode',
  //       key: 'securityCode',
  //       url: '/auth/security-code',
  //     },
  //     {
  //       title: 'common.newPassword',
  //       key: 'newPass',
  //       url: '/auth/new-password',
  //     },
  //   ],
  // },
  // 表单 - 金融项目不需要
  // {
  //   title: 'common.forms',
  //   key: 'forms',
  //   icon: <FormOutlined />,
  //   children: [
  //     {
  //       title: 'common.advancedForms',
  //       key: 'advanced-forms',
  //       url: '/forms/advanced-forms',
  //     },
  //   ],
  // },
  // 数据表格 - 保留，股票列表使用了表格
  // {
  //   title: 'common.dataTables',
  //   key: 'dataTables',
  //   url: '/data-tables',
  //   icon: <TableOutlined />,
  // },
  // 图表 - 保留，K线图是图表
  // {
  //   title: 'common.charts',
  //   key: 'charts',
  //   url: '/charts',
  //   icon: <LineChartOutlined />,
  // },
  // 地图 - 金融项目不需要
  // {
  //   title: 'common.maps',
  //   key: 'maps',
  //   icon: <CompassOutlined />,
  //   children: [
  //     {
  //       title: 'common.googleMap',
  //       key: 'google-maps',
  //       url: '/maps/google-maps',
  //     },
  //     {
  //       title: 'common.leafletMap',
  //       key: 'leaflet-maps',
  //       url: '/maps/leaflet-maps',
  //     },
  //     {
  //       title: 'common.reactSimpleMaps',
  //       key: 'react-simple-maps',
  //       url: '/maps/react-simple-maps',
  //     },
  //     {
  //       title: 'common.pigeonMaps',
  //       key: 'pigeon-maps',
  //       url: '/maps/pigeon-maps',
  //     },
  //   ],
  // },
  // 页面 - 保留个人资料，其他不需要
  // {
  //   title: 'common.pages',
  //   key: 'pages',
  //   icon: <LayoutOutlined />,
  //   children: [
  //     {
  //       title: 'common.profilePage',
  //       key: 'profile',
  //       url: '/profile',
  //     },
  //     {
  //       title: 'common.serverError',
  //       key: 'serverError',
  //       url: '/server-error',
  //     },
  //     {
  //       title: 'common.clientError',
  //       key: '404Error',
  //       url: '/404',
  //     },
  //   ],
  // },
  // UI组件 - 金融项目不需要展示UI组件
  // {
  //   title: 'common.ui',
  //   key: 'ui',
  //   icon: <BlockOutlined />,
  //   children: [
  //     {
  //       title: 'common.alert',
  //       key: 'alert',
  //       url: '/ui-components/alert',
  //     },
  //     {
  //       title: 'common.avatar',
  //       key: 'avatar',
  //       url: '/ui-components/avatar',
  //     },
  //     {
  //       title: 'common.autocomplete',
  //       key: 'auto-complete',
  //       url: '/ui-components/auto-complete',
  //     },
  //     {
  //       title: 'common.badge',
  //       key: 'badge',
  //       url: '/ui-components/badge',
  //     },
  //     {
  //       title: 'common.breadcrumbs',
  //       key: 'breadcrumbs',
  //       url: '/ui-components/breadcrumbs',
  //     },
  //     {
  //       title: 'common.button',
  //       key: 'button',
  //       url: '/ui-components/button',
  //     },
  //     {
  //       title: 'common.checkbox',
  //       key: 'checkbox',
  //       url: '/ui-components/checkbox',
  //     },
  //     {
  //       title: 'common.collapse',
  //       key: 'collapse',
  //       url: '/ui-components/collapse',
  //     },
  //     {
  //       title: 'common.dateTimePicker',
  //       key: 'dateTimePicker',
  //       url: '/ui-components/date-time-picker',
  //     },
  //     {
  //       title: 'common.dropdown',
  //       key: 'dropdown',
  //       url: '/ui-components/dropdown',
  //     },
  //     {
  //       title: 'common.input',
  //       key: 'input',
  //       url: '/ui-components/input',
  //     },
  //     {
  //       title: 'common.modal',
  //       key: 'modal',
  //       url: '/ui-components/modal',
  //     },
  //     {
  //       title: 'common.notification',
  //       key: 'notification',
  //       url: '/ui-components/notification',
  //     },
  //     {
  //       title: 'common.pagination',
  //       key: 'pagination',
  //       url: '/ui-components/pagination',
  //     },
  //     {
  //       title: 'common.popconfirm',
  //       key: 'popconfirm',
  //       url: '/ui-components/popconfirm',
  //     },
  //     {
  //       title: 'common.popover',
  //       key: 'popover',
  //       url: '/ui-components/popover',
  //     },
  //     {
  //       title: 'common.progress',
  //       key: 'progress',
  //       url: '/ui-components/progress',
  //     },
  //     {
  //       title: 'common.radio',
  //       key: 'radio',
  //       url: '/ui-components/radio',
  //     },
  //     {
  //       title: 'common.rate',
  //       key: 'rate',
  //       url: '/ui-components/rate',
  //     },
  //     {
  //       title: 'common.result',
  //       key: 'result',
  //       url: '/ui-components/result',
  //     },
  //     {
  //       title: 'common.select',
  //       key: 'select',
  //       url: '/ui-components/select',
  //     },
  //     {
  //       title: 'common.skeleton',
  //       key: 'skeleton',
  //       url: '/ui-components/skeleton',
  //     },
  //     {
  //       title: 'common.spinner',
  //       key: 'spinner',
  //       url: '/ui-components/spinner',
  //     },
  //     {
  //       title: 'common.steps',
  //       key: 'steps',
  //       url: '/ui-components/steps',
  //     },
  //     {
  //       title: 'common.switch',
  //       key: 'switch',
  //       url: '/ui-components/switch',
  //     },
  //     {
  //       title: 'common.tabs',
  //       key: 'tabs',
  //       url: '/ui-components/tabs',
  //     },
  //     {
  //       title: 'common.upload',
  //       key: 'upload',
  //       url: '/ui-components/upload',
  //     },
  //   ],
  // },
];
