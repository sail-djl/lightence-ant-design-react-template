import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import { MenuItem, getAllMenus, createMenu, updateMenu, deleteMenu } from '@app/api/menu.api';
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
  const [filteredTree, setFilteredTree] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState(initialPagination);
  const [total, setTotal] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingMenu, setEditingMenu] = useState<MenuItem | null>(null);
  const [form] = BaseForm.useForm<MenuFormData>();
  const [allMenus, setAllMenus] = useState<MenuItem[]>([]);
  const [query, setQuery] = useState<{ keyword: string }>({
    keyword: '',
  });

  const getErrorMessage = (error: unknown, fallback: string) => {
    if (error && typeof error === 'object' && 'message' in (error as any)) {
      return (error as any).message || fallback;
    }
    return fallback;
  };

  const applyFilters = useCallback((items: MenuItem[]) => {
    const kw = query.keyword.trim().toLowerCase();
    if (!kw) {
      return items;
    }
    return items.filter((i) => {
      const values = [i.key, i.title, i.url || '', i.icon || ''];
      return values.some((v) => v?.toLowerCase().includes(kw));
    });
  }, [query]);

  const applyTreeFilters = useCallback((items: MenuItem[]): MenuItem[] => {
    const kw = query.keyword.trim().toLowerCase();
    if (!kw) {
      return items;
    }
    const matchNode = (i: MenuItem) => {
      const values = [i.key, i.title, i.url || '', i.icon || ''];
      return values.some((v) => v?.toLowerCase().includes(kw));
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

  // 构建菜单树（从扁平列表构建树形结构）
  const buildMenuTree = useCallback((items: MenuItem[]): MenuItem[] => {
    if (!items || items.length === 0) {
      return [];
    }

    // 创建权限字典
    const permissionDict = new Map<number, MenuItem>();
    items.forEach((item) => {
      permissionDict.set(item.id, { ...item, children: [] });
    });

    const rootPermissions: MenuItem[] = [];

    // 构建树形结构
    items.forEach((item) => {
      const permission = permissionDict.get(item.id)!;
      if (item.parent_id === null || item.parent_id === undefined) {
        rootPermissions.push(permission);
      } else {
        const parent = permissionDict.get(item.parent_id);
        if (parent && parent.children) {
          parent.children.push(permission);
        }
      }
    });

    // 对每个权限的子权限进行排序
    const sortChildren = (permission: MenuItem) => {
      if (permission.children && permission.children.length > 0) {
        permission.children.sort((a, b) => {
          if (a.sort_order !== b.sort_order) {
            return a.sort_order - b.sort_order;
          }
          return a.id - b.id;
        });
        permission.children.forEach((child) => sortChildren(child));
      } else {
        // 如果没有子权限，设置为 undefined（而不是空数组）
        permission.children = undefined;
      }
    };

    rootPermissions.forEach((permission) => sortChildren(permission));
    rootPermissions.sort((a, b) => {
      if (a.sort_order !== b.sort_order) {
        return a.sort_order - b.sort_order;
      }
      return a.id - b.id;
    });

    return rootPermissions;
  }, []);

  // 从 allMenus 构建菜单树
  const menuTree = useMemo(() => {
    return buildMenuTree(allMenus);
  }, [allMenus, buildMenuTree]);

  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

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

  const handleAddChild = (parentMenu: MenuItem) => {
    setEditingMenu(null);
    form.resetFields();
    form.setFieldsValue({
      sort_order: 0,
      is_active: true,
      parent_id: parentMenu.id,
    });
    setIsModalVisible(true);
  };
  
  // 编辑-打开
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
    } catch (error: unknown) {
      notificationController.error({
        message: getErrorMessage(error, '删除菜单失败'),
      });
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // 调试日志：查看表单值
      console.log('Form values:', values);
      console.log('is_active value:', values.is_active);
      console.log('is_active type:', typeof values.is_active);

      if (editingMenu) {
        // 显式构建更新对象，确保所有字段正确传递
        const updateData: Partial<MenuFormData> = {
          key: values.key,
          title: values.title,
          url: values.url,
          parent_id: values.parent_id,
          icon: values.icon,
          sort_order: values.sort_order,
          is_active: values.is_active, // 直接使用表单值
        };
        console.log('Update data:', updateData);
        await updateMenu(editingMenu.id, updateData);
        notificationController.success({ message: '菜单更新成功' });
      } else {
        await createMenu(values);
        notificationController.success({ message: '菜单创建成功' });
      }

      setIsModalVisible(false);
      fetchMenus(pagination.current, pagination.pageSize);
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
      width: 250,
      align: 'center',
      render: (_, record: MenuItem) => (
        <BaseSpace>
          <BaseButton type="link" onClick={() => handleAddChild(record)}>
            新增
          </BaseButton>
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
          <BaseButton onClick={() => setFilteredTree(applyTreeFilters(menuTree))}>查询</BaseButton>
          <BaseButton onClick={() => fetchMenus(pagination.current, pagination.pageSize)}>刷新</BaseButton>
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
            <BaseInput placeholder="menu.key" />
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

          <BaseForm.Item>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <BaseForm.Item name="is_active" valuePropName="checked" noStyle>
                <BaseSwitch checkedChildren="启用" unCheckedChildren="停用" />
              </BaseForm.Item>
              <S.Label>启用</S.Label>
            </div>
          </BaseForm.Item>
        </BaseForm>
      </BaseModal>
    </>
  );
};

export default MenuManagementPage;
