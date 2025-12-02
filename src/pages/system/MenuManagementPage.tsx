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
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState(initialPagination);
  const [total, setTotal] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingMenu, setEditingMenu] = useState<MenuItem | null>(null);
  const [form] = BaseForm.useForm<MenuFormData>();

  const getErrorMessage = (error: unknown, fallback: string) => (error instanceof Error ? error.message : fallback);

  const fetchMenus = useCallback(async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const skip = (page - 1) * pageSize;
      const response = await getAllMenus(skip, pageSize);
      setMenus(response.data);
      setTotal(response.count);
      setPagination({ current: page, pageSize });
    } catch (error: unknown) {
      notificationController.error({ message: getErrorMessage(error, 'Failed to fetch menus') });
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMenuTree = useCallback(async () => {
    try {
      const tree = await getMenuTree();
      setMenuTree(tree);
    } catch (error: unknown) {
      console.error('Failed to fetch menu tree:', error);
    }
  }, []);

  useEffect(() => {
    fetchMenus();
    fetchMenuTree();
  }, [fetchMenus, fetchMenuTree]);

  const handleTableChange = (page: number, pageSize: number) => {
    fetchMenus(page, pageSize);
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
      notificationController.success({ message: 'Menu deleted successfully' });
      fetchMenus(pagination.current, pagination.pageSize);
      fetchMenuTree();
    } catch (error: unknown) {
      notificationController.error({
        message: getErrorMessage(error, 'Failed to delete menu'),
      });
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (editingMenu) {
        await updateMenu(editingMenu.id, values);
        notificationController.success({ message: 'Menu updated successfully' });
      } else {
        await createMenu(values);
        notificationController.success({ message: 'Menu created successfully' });
      }

      setIsModalVisible(false);
      fetchMenus(pagination.current, pagination.pageSize);
      fetchMenuTree();
    } catch (error: unknown) {
      notificationController.error({ message: getErrorMessage(error, 'Failed to save menu') });
    }
  };

  // 构建父菜单选项（扁平化菜单树）
  const buildParentOptions = (items: MenuItem[], level = 0): Array<{ value: number; label: string }> => {
    const options: Array<{ value: number; label: string }> = [];
    items.forEach((item) => {
      options.push({
        value: item.id,
        label: '  '.repeat(level) + item.title,
      });
      if (item.children && item.children.length > 0) {
        options.push(...buildParentOptions(item.children, level + 1));
      }
    });
    return options;
  };

  const columns: ColumnsType<MenuItem> = [
    {
      title: 'Key',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'URL',
      dataIndex: 'url',
      key: 'url',
      render: (text: string) => text || '-',
    },
    {
      title: 'Icon',
      dataIndex: 'icon',
      key: 'icon',
      render: (text: string) => text || '-',
    },
    {
      title: 'Sort Order',
      dataIndex: 'sort_order',
      key: 'sort_order',
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (isActive: boolean) => (isActive ? 'Active' : 'Inactive'),
    },
    {
      title: t('tables.actions'),
      key: 'actions',
      width: 200,
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
      <PageTitle>Menu Management</PageTitle>
      <S.Card>
        <S.Header>
          <S.Title>Menus</S.Title>
          <BaseButton type="primary" onClick={handleCreate}>
            {t('common.create')} Menu
          </BaseButton>
        </S.Header>
        <BaseTable
          columns={columns}
          dataSource={menus}
          rowKey="id"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: total,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} menus`,
          }}
          onChange={(pageConfig) => {
            handleTableChange(pageConfig.current || 1, pageConfig.pageSize || 10);
          }}
        />
      </S.Card>

      <BaseModal
        title={editingMenu ? 'Edit Menu' : 'Create Menu'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <BaseForm form={form} layout="vertical">
          <BaseForm.Item name="key" label="Key" rules={[{ required: true, message: 'Key is required' }]}>
            <BaseInput placeholder="menu.key" disabled={!!editingMenu} />
          </BaseForm.Item>

          <BaseForm.Item name="title" label="Title" rules={[{ required: true, message: 'Title is required' }]}>
            <BaseInput placeholder="Menu Title" />
          </BaseForm.Item>

          <BaseForm.Item name="url" label="URL">
            <BaseInput placeholder="/path/to/page" />
          </BaseForm.Item>

          <BaseForm.Item name="icon" label="Icon">
            <IconPicker placeholder="点击选择图标" />
          </BaseForm.Item>

          <BaseForm.Item name="parent_id" label="Parent Menu">
            <BaseSelect placeholder="Select parent menu" allowClear options={buildParentOptions(menuTree)} />
          </BaseForm.Item>

          <BaseForm.Item
            name="sort_order"
            label="Sort Order"
            rules={[{ required: true, message: 'Sort order is required' }]}
          >
            <InputNumber min={0} placeholder="0" style={{ width: '100%' }} />
          </BaseForm.Item>

          <BaseForm.Item name="is_active" valuePropName="checked">
            <BaseSwitch checkedChildren="Active" unCheckedChildren="Inactive" />
            <S.Label>Active</S.Label>
          </BaseForm.Item>
        </BaseForm>
      </BaseModal>
    </>
  );
};

export default MenuManagementPage;
