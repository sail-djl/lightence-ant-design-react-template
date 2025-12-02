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
import { BaseCheckbox } from '@app/components/common/BaseCheckbox/BaseCheckbox';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { notificationController } from '@app/controllers/notificationController';
import { ColumnsType } from 'antd/es/table';
import {
  Role,
  getRoles,
  createRole,
  updateRole,
  deleteRole,
  getRolePermissions,
  assignPermissionsToRole,
  Permission,
} from '@app/api/roles.api';
import { getMenuTree, MenuItem } from '@app/api/menu.api';
import { Tree } from 'antd';
import * as S from './RoleManagementPage.styles';

interface RoleFormData {
  name: string;
  code: string;
  description?: string;
  is_active: boolean;
  sort_order: number;
}

const initialPagination = {
  current: 1,
  pageSize: 10,
};

export const RoleManagementPage: React.FC = () => {
  const { t } = useTranslation();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState(initialPagination);
  const [total, setTotal] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPermissionModalVisible, setIsPermissionModalVisible] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [form] = BaseForm.useForm<RoleFormData>();
  const [menuTree, setMenuTree] = useState<MenuItem[]>([]);
  const [rolePermissions, setRolePermissions] = useState<number[]>([]);

  const getErrorMessage = (error: unknown, fallback: string) => (error instanceof Error ? error.message : fallback);

  const fetchRoles = useCallback(async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const skip = (page - 1) * pageSize;
      const response = await getRoles(skip, pageSize);
      setRoles(response.data);
      setTotal(response.count);
      setPagination({ current: page, pageSize });
    } catch (error: unknown) {
      notificationController.error({ message: getErrorMessage(error, 'Failed to fetch roles') });
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
    fetchRoles();
    fetchMenuTree();
  }, [fetchRoles, fetchMenuTree]);

  const handleTableChange = (page: number, pageSize: number) => {
    fetchRoles(page, pageSize);
  };

  const handleCreate = () => {
    setEditingRole(null);
    form.resetFields();
    form.setFieldsValue({
      is_active: true,
      sort_order: 0,
    });
    setIsModalVisible(true);
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    form.setFieldsValue({
      name: role.name,
      code: role.code,
      description: role.description || '',
      is_active: role.is_active,
      sort_order: role.sort_order,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (role: Role) => {
    try {
      await deleteRole(role.id);
      notificationController.success({ message: 'Role deleted successfully' });
      fetchRoles(pagination.current, pagination.pageSize);
    } catch (error: unknown) {
      notificationController.error({ message: getErrorMessage(error, 'Failed to delete role') });
    }
  };

  const handleManagePermissions = async (role: Role) => {
    setSelectedRole(role);
    try {
      const rolePerms = await getRolePermissions(role.id);
      setRolePermissions(rolePerms.map((p) => p.id)); // p.id 是 number 类型
      setIsPermissionModalVisible(true);
    } catch (error: unknown) {
      notificationController.error({
        message: getErrorMessage(error, 'Failed to fetch role permissions'),
      });
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (editingRole) {
        await updateRole(editingRole.id, values);
        notificationController.success({ message: 'Role updated successfully' });
      } else {
        await createRole(values);
        notificationController.success({ message: 'Role created successfully' });
      }

      setIsModalVisible(false);
      fetchRoles(pagination.current, pagination.pageSize);
    } catch (error: unknown) {
      notificationController.error({ message: getErrorMessage(error, 'Failed to save role') });
    }
  };

  const handleSavePermissions = async () => {
    if (!selectedRole) return;

    try {
      await assignPermissionsToRole(selectedRole.id, rolePermissions);
      notificationController.success({ message: 'Permissions assigned successfully' });
      setIsPermissionModalVisible(false);
      fetchRoles(pagination.current, pagination.pageSize);
    } catch (error: unknown) {
      notificationController.error({
        message: getErrorMessage(error, 'Failed to assign permissions'),
      });
    }
  };

  // 将菜单树转换为 Tree 组件需要的格式
  const buildTreeData = (menus: MenuItem[]): any[] => {
    return menus.map((menu) => ({
      title: menu.title,
      key: menu.id,
      children: menu.children ? buildTreeData(menu.children) : undefined,
    }));
  };

  // 收集所有菜单 ID（包括子菜单）
  const collectMenuIds = (menus: MenuItem[]): number[] => {
    const ids: number[] = [];
    const traverse = (items: MenuItem[]) => {
      items.forEach((item) => {
        ids.push(item.id);
        if (item.children) {
          traverse(item.children);
        }
      });
    };
    traverse(menus);
    return ids;
  };

  const onCheck = (checkedKeys: any) => {
    setRolePermissions(checkedKeys.checked || checkedKeys);
  };

  const columns: ColumnsType<Role> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => text || '-',
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (isActive: boolean) => (isActive ? 'Active' : 'Inactive'),
    },
    {
      title: 'Sort Order',
      dataIndex: 'sort_order',
      key: 'sort_order',
    },
    {
      title: t('tables.actions'),
      key: 'actions',
      width: 250,
      render: (_, record: Role) => (
        <BaseSpace>
          <BaseButton type="link" onClick={() => handleEdit(record)}>
            {t('common.edit')}
          </BaseButton>
          <BaseButton type="link" onClick={() => handleManagePermissions(record)}>
            Permissions
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
      <PageTitle>Role Management</PageTitle>
      <S.Card>
        <S.Header>
          <S.Title>Roles</S.Title>
          <BaseButton type="primary" onClick={handleCreate}>
            {t('common.create')} Role
          </BaseButton>
        </S.Header>
        <BaseTable
          columns={columns}
          dataSource={roles}
          rowKey="id"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: total,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} roles`,
          }}
          onChange={(pageConfig) => {
            handleTableChange(pageConfig.current || 1, pageConfig.pageSize || 10);
          }}
        />
      </S.Card>

      {/* 角色编辑/创建弹窗 */}
      <BaseModal
        title={editingRole ? 'Edit Role' : 'Create Role'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <BaseForm form={form} layout="vertical">
          <BaseForm.Item name="name" label="Name" rules={[{ required: true, message: 'Name is required' }]}>
            <BaseInput placeholder="Role Name" />
          </BaseForm.Item>

          <BaseForm.Item name="code" label="Code" rules={[{ required: true, message: 'Code is required' }]}>
            <BaseInput placeholder="role_code" disabled={!!editingRole} />
          </BaseForm.Item>

          <BaseForm.Item name="description" label="Description">
            <BaseInput.TextArea placeholder="Role description" rows={3} />
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

      {/* 权限分配弹窗 */}
      <BaseModal
        title={`Manage Permissions - ${selectedRole?.name || ''}`}
        open={isPermissionModalVisible}
        onOk={handleSavePermissions}
        onCancel={() => setIsPermissionModalVisible(false)}
        width={800}
      >
        <S.PermissionsContainer>
          <Tree
            checkable
            checkedKeys={rolePermissions}
            onCheck={onCheck}
            treeData={buildTreeData(menuTree)}
            defaultExpandAll
          />
        </S.PermissionsContainer>
      </BaseModal>
    </>
  );
};

export default RoleManagementPage;
