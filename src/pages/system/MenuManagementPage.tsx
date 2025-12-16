import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';
import { InputNumber } from '@app/components/common/inputs/InputNumber/InputNumber';
import { BaseSwitch } from '@app/components/common/BaseSwitch/BaseSwitch';
import { BaseSelect } from '@app/components/common/selects/BaseSelect/BaseSelect';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { notificationController } from '@app/controllers/notificationController';
import { ColumnsType } from 'antd/es/table';
import { MenuItem, getAllMenus, createMenu, updateMenu, deleteMenu, getMenuTree } from '@app/api/menu.api';
import { IconPicker } from '@app/components/common/IconPicker/IconPicker';
import * as S from './MenuManagementPage.styles';

interface MenuFormData {
  key: string;
  title: string;
  url?: string;
  parent_id?: number | null;
  icon?: string;
  sort_order: number;
  is_active: boolean;
}

const initialPagination = {
  current: 1,
  pageSize: 10,
};

export const MenuManagementPage: React.FC = () => {
  const { t } = useTranslation();
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [menuTree, setMenuTree] = useState<MenuItem[]>([]);
  const [filteredTree, setFilteredTree] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState(initialPagination);
  const [total, setTotal] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingMenu, setEditingMenu] = useState<MenuItem | null>(null);
  const [form] = BaseForm.useForm<MenuFormData>();
  const [allMenus, setAllMenus] = useState<MenuItem[]>([]);
  const [query, setQuery] = useState<{ keyword: string; status: 'all' | 'active' | 'inactive' }>({
    keyword: '',
    status: 'all',
  });

  const getErrorMessage = (error: unknown, fallback: string) => {
    if (error && typeof error === 'object' && 'message' in (error as any)) {
      return (error as any).message || fallback;
    }
    return fallback;
  };

  const applyFilters = useCallback((items: MenuItem[]) => {
    const kw = query.keyword.trim().toLowerCase();
    let filtered = items;
    if (kw) {
      filtered = filtered.filter((i) => {
        const values = [i.key, i.title, i.url || '', i.icon || ''];
        return values.some((v) => v?.toLowerCase().includes(kw));
      });
    }
    if (query.status !== 'all') {
      const active = query.status === 'active';
      filtered = filtered.filter((i) => i.is_active === active);
    }
    return filtered;
  }, [query]);

  const applyTreeFilters = useCallback((items: MenuItem[]): MenuItem[] => {
    const kw = query.keyword.trim().toLowerCase();
    const matchNode = (i: MenuItem) => {
      const values = [i.key, i.title, i.url || '', i.icon || ''];
      const kwMatch = kw ? values.some((v) => v?.toLowerCase().includes(kw)) : true;
      const statusMatch = query.status === 'all' ? true : i.is_active === (query.status === 'active');
      return kwMatch && statusMatch;
    };
    const filterRecursive = (nodes: MenuItem[]): MenuItem[] => {
      return nodes
        .map((node) => {
          const children = node.children ? filterRecursive(node.children) : undefined;
          const selfMatch = matchNode(node);
          if (selfMatch || (children && children.length)) {
            return { ...node, ...(children && { children }) };
          }
          return null;
        })
        .filter((n): n is MenuItem => n !== null);
    };
    return filterRecursive(items);
  }, [query]);

  const fetchMenus = useCallback(async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const response = await getAllMenus(0, 1000);
      setAllMenus(response.data);
      const filtered = applyFilters(response.data);
      const start = (page - 1) * pageSize;
      setMenus(filtered.slice(start, start + pageSize));
      setTotal(filtered.length);
      setPagination({ current: page, pageSize });
    } catch (error: unknown) {
      notificationController.error({ message: getErrorMessage(error, '获取菜单失败') });
    } finally {
      setLoading(false);
    }
  }, [applyFilters]);

  const fetchMenuTree = useCallback(async () => {
    try {
      const tree = await getMenuTree();
      setMenuTree(tree);
    } catch (error: unknown) {
      console.error('获取菜单树失败:', error);
    }
  }, []);

  useEffect(() => {
    fetchMenus();
    fetchMenuTree();
  }, [fetchMenus, fetchMenuTree]);

  useEffect(() => {
    setFilteredTree(applyTreeFilters(menuTree));
  }, [menuTree, applyTreeFilters]);

  const updateDisplay = useCallback((page: number, pageSize: number) => {
    const filtered = applyFilters(allMenus);
    const start = (page - 1) * pageSize;
    setMenus(filtered.slice(start, start + pageSize));
    setTotal(filtered.length);
    setPagination({ current: page, pageSize });
  }, [allMenus, applyFilters]);

  const handleTableChange = (page: number, pageSize: number) => {
    updateDisplay(page, pageSize);
  };

  const handleCreate = () => {
    setEditingMenu(null);
    form.resetFields();
    form.setFieldsValue({
      sort_order: 0,
      is_active: true,
      parent_id: null,
    });
    setIsModalVisible(true);
  };

  const handleEdit = (menu: MenuItem) => {
    setEditingMenu(menu);
    form.setFieldsValue({
      key: menu.key,
      title: menu.title,
      url: menu.url || '',
      parent_id: menu.parent_id || null,
      icon: menu.icon || '',
      sort_order: menu.sort_order,
      is_active: menu.is_active,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (menu: MenuItem) => {
    try {
      await deleteMenu(menu.id);
      notificationController.success({ message: '菜单删除成功' });
      fetchMenus(pagination.current, pagination.pageSize);
      fetchMenuTree();
    } catch (error: unknown) {
      notificationController.error({
        message: getErrorMessage(error, '删除菜单失败'),
      });
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (editingMenu) {
        await updateMenu(editingMenu.id, values);
        notificationController.success({ message: '菜单更新成功' });
      } else {
        await createMenu(values);
        notificationController.success({ message: '菜单创建成功' });
      }

      setIsModalVisible(false);
      fetchMenus(pagination.current, pagination.pageSize);
      fetchMenuTree();
    } catch (error: unknown) {
      notificationController.error({ message: getErrorMessage(error, '保存菜单失败') });
    }
  };

  // 构建父菜单选项（扁平化菜单树）
  const buildParentOptions = (items: MenuItem[], level = 0): Array<{ value: number; label: string }> => {
    const options: Array<{ value: number; label: string }> = [];
    items.forEach((item) => {
      options.push({
        value: item.id,
        label: '  '.repeat(level) + t(item.title),
      });
      if (item.children && item.children.length > 0) {
        options.push(...buildParentOptions(item.children, level + 1));
      }
    });
    return options;
  };

  const columns: ColumnsType<MenuItem> = [
        {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => t(text),
      align: 'center',
    },
    {
      title: '键',
      dataIndex: 'key',
      key: 'key',
      align: 'center',
    },
    {
      title: 'URL',
      dataIndex: 'url',
      key: 'url',
      render: (text: string) => text || '-',
      align: 'center',
    },
    {
      title: '图标',
      dataIndex: 'icon',
      key: 'icon',
      render: (text: string) => text || '-',
      align: 'center',
    },
    {
      title: '排序',
      dataIndex: 'sort_order',
      key: 'sort_order',
      align: 'center',
    },
    {
      title: '状态',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (isActive: boolean) => (isActive ? '启用' : '停用'),
      align: 'center',
    },
    {
      title: t('tables.actions'),
      key: 'actions',
      width: 200,
      align: 'center',
      render: (_, record: MenuItem) => (
        <BaseSpace>
          <BaseButton type="link" onClick={() => handleEdit(record)}>
            {t('common.edit')}
          </BaseButton>
          <BaseButton type="link" danger onClick={() => handleDelete(record)}>
            {t('common.delete')}
          </BaseButton>
        </BaseSpace>
      ),
    },
  ];

  return (
    <>
      <S.Card>
        <S.Header>
          <S.Title>{t('common.menu-management')}</S.Title>
        </S.Header>
        <BaseSpace style={{ display: 'flex', marginBottom: '1rem' }}>
          <BaseInput
            placeholder="关键词（键/标题/URL）"
            allowClear
            value={query.keyword}
            onChange={(e) => setQuery((prev) => ({ ...prev, keyword: e.target.value }))}
            style={{ width: 220 }}
          />
          <BaseSelect
            value={query.status}
            onChange={(val) => setQuery((prev) => ({ ...prev, status: val as 'all' | 'active' | 'inactive' }))}
            options={[
              { value: 'all', label: '全部' },
              { value: 'active', label: '启用' },
              { value: 'inactive', label: '停用' },
            ]}
            style={{ width: 120 }}
          />
          <BaseButton onClick={() => setFilteredTree(applyTreeFilters(menuTree))}>查询</BaseButton>
          <BaseButton onClick={fetchMenuTree}>刷新</BaseButton>
        </BaseSpace>
        <BaseSpace style={{ display: 'flex' }}>
          <BaseButton type="primary" onClick={handleCreate}>
            {`${t('common.create')} ${t('common.menu-management')}`}
          </BaseButton>
        </BaseSpace>
        <BaseTable
          columns={columns}
          dataSource={filteredTree.length ? filteredTree : menuTree}
          rowKey="id"
          loading={loading}
          pagination={false}
          expandable={{ defaultExpandAllRows: true }}
        />
      </S.Card>

      <BaseModal
        title={editingMenu ? '编辑菜单' : '创建菜单'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <BaseForm form={form} layout="vertical">
          <BaseForm.Item name="key" label="键" rules={[{ required: true, message: '请输入键' }]}>
            <BaseInput placeholder="menu.key" disabled={!!editingMenu} />
          </BaseForm.Item>

          <BaseForm.Item name="title" label="标题" rules={[{ required: true, message: '请输入标题' }]}>
            <BaseInput placeholder="菜单标题" />
          </BaseForm.Item>

          <BaseForm.Item name="url" label="URL">
            <BaseInput placeholder="/path/to/page" />
          </BaseForm.Item>

          <BaseForm.Item name="icon" label="图标">
            <IconPicker placeholder="点击选择图标" />
          </BaseForm.Item>

          <BaseForm.Item name="parent_id" label="父菜单">
            <BaseSelect placeholder="选择父菜单" allowClear options={buildParentOptions(menuTree)} />
          </BaseForm.Item>

          <BaseForm.Item
            name="sort_order"
            label="排序"
            rules={[{ required: true, message: '请输入排序' }]}
          >
            <InputNumber min={0} placeholder="0" style={{ width: '100%' }} />
          </BaseForm.Item>

          <BaseForm.Item name="is_active" valuePropName="checked">
            <BaseSwitch checkedChildren="启用" unCheckedChildren="停用" />
            <S.Label>启用</S.Label>
          </BaseForm.Item>
        </BaseForm>
      </BaseModal>
    </>
  );
};

export default MenuManagementPage;
