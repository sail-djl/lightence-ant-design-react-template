import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import * as S from './SiderMenu.styles';
import { convertMenuToSidebarNavigation, SidebarNavigationItem } from '../sidebarNavigation';
import { getMenuTree, MenuItem } from '@app/api/menu.api';

interface SiderContentProps {
  setCollapsed: (isCollapsed: boolean) => void;
}

const SiderMenu: React.FC<SiderContentProps> = ({ setCollapsed }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const [sidebarNavigation, setSidebarNavigation] = useState<SidebarNavigationItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 从后端获取菜单数据
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const menus = await getMenuTree();
        const navigation = convertMenuToSidebarNavigation(menus);
        setSidebarNavigation(navigation);
      } catch (error) {
        console.error('Failed to fetch menu:', error);
        // 如果获取失败，使用空数组（不显示菜单）
        setSidebarNavigation([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  // 将嵌套菜单结构扁平化
  const sidebarNavFlat = sidebarNavigation.reduce(
    (result: SidebarNavigationItem[], current) =>
      result.concat(current.children && current.children.length > 0 ? current.children : current),
    [],
  );

  const currentMenuItem = sidebarNavFlat.find(({ url }) => url === location.pathname);
  const defaultSelectedKeys = currentMenuItem ? [currentMenuItem.key] : [];

  const openedSubmenu = sidebarNavigation.find(({ children }) =>
    children?.some(({ url }) => url === location.pathname),
  );
  const defaultOpenKeys = openedSubmenu ? [openedSubmenu.key] : [];

  // 如果正在加载，显示空菜单
  if (loading) {
    return <S.Menu mode="inline" items={[]} />;
  }

  return (
    <S.Menu
      mode="inline"
      defaultSelectedKeys={defaultSelectedKeys}
      defaultOpenKeys={defaultOpenKeys}
      onClick={() => setCollapsed(true)}
      items={sidebarNavigation.map((nav) => {
        const isSubMenu = nav.children?.length;

        return {
          key: nav.key,
          title: t(nav.title),
          label: isSubMenu ? t(nav.title) : <Link to={nav.url || ''}>{t(nav.title)}</Link>,
          icon: nav.icon,
          children:
            isSubMenu &&
            nav.children &&
            nav.children.map((childNav) => ({
              key: childNav.key,
              label: <Link to={childNav.url || ''}>{t(childNav.title)}</Link>,
              title: t(childNav.title),
            })),
        };
      })}
    />
  );
};

export default SiderMenu;
