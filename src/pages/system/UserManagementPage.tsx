import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';
import { BaseSwitch } from '@app/components/common/BaseSwitch/BaseSwitch';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { notificationController } from '@app/controllers/notificationController';
import { ColumnsType } from 'antd/es/table';
import {
  User,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserRoles,
  UserUpdate,
  UserCreate,
} from '@app/api/users.api';
import { Role } from '@app/api/roles.api';
import * as S from './UserManagementPage.styles';

interface UserFormData {
  email: string;
  password?: string;
  full_name?: string;
  is_active: boolean;
  is_superuser: boolean;
}

const initialPagination = {
  current: 1,
  pageSize: 10,
};

export const UserManagementPage: React.FC = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState(initialPagination);
  const [total, setTotal] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = BaseForm.useForm<UserFormData>();
  const [userRoles, setUserRoles] = useState<Record<string, Role[]>>({});

  const getErrorMessage = (error: unknown, fallback: string) => (error instanceof Error ? error.message : fallback);

  const fetchUsers = useCallback(async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const skip = (page - 1) * pageSize;
      const response = await getUsers(skip, pageSize);
      setUsers(response.data);
      setTotal(response.count);
      setPagination({ current: page, pageSize });

      const rolesMap: Record<string, Role[]> = {};
      for (const user of response.data) {
        try {
          const userRolesList = await getUserRoles(user.id);
          rolesMap[user.id] = userRolesList;
        } catch {
          rolesMap[user.id] = [];
        }
      }
      setUserRoles(rolesMap);
    } catch (error: unknown) {
      notificationController.error({ message: getErrorMessage(error, 'Failed to fetch users') });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleTableChange = (page: number, pageSize: number) => {
    fetchUsers(page, pageSize);
  };

  const handleCreate = () => {
    setEditingUser(null);
    form.resetFields();
    form.setFieldsValue({
      is_active: true,
      is_superuser: false,
    });
    setIsModalVisible(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    form.setFieldsValue({
      email: user.email,
      full_name: user.full_name || '',
      is_active: user.is_active,
      is_superuser: user.is_superuser,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (user: User) => {
    try {
      await deleteUser(user.id);
      notificationController.success({ message: 'User deleted successfully' });
      fetchUsers(pagination.current, pagination.pageSize);
    } catch (error: unknown) {
      notificationController.error({ message: getErrorMessage(error, 'Failed to delete user') });
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (editingUser) {
        const updateData: UserUpdate = {
          email: values.email,
          full_name: values.full_name,
          is_active: values.is_active,
          is_superuser: values.is_superuser,
        };
        if (values.password) {
          updateData.password = values.password;
        }
        await updateUser(editingUser.id, updateData);
        notificationController.success({ message: 'User updated successfully' });
      } else {
        if (!values.password) {
          notificationController.error({ message: 'Password is required for new users' });
          return;
        }
        const payload: UserCreate = {
          email: values.email,
          password: values.password,
          full_name: values.full_name,
          is_active: values.is_active,
          is_superuser: values.is_superuser,
        };
        await createUser(payload);
        notificationController.success({ message: 'User created successfully' });
      }

      setIsModalVisible(false);
      fetchUsers(pagination.current, pagination.pageSize);
    } catch (error: unknown) {
      notificationController.error({ message: getErrorMessage(error, 'Failed to save user') });
    }
  };

  const columns: ColumnsType<User> = [
    {
      title: t('common.email'),
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: t('common.name'),
      dataIndex: 'full_name',
      key: 'full_name',
      render: (text: string | null) => text || '-',
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (isActive: boolean) => (isActive ? 'Active' : 'Inactive'),
    },
    {
      title: 'Superuser',
      dataIndex: 'is_superuser',
      key: 'is_superuser',
      render: (isSuperuser: boolean) => (isSuperuser ? 'Yes' : 'No'),
    },
    {
      title: 'Roles',
      key: 'roles',
      render: (_, record: User) => {
        const roles = userRoles[record.id] || [];
        return roles.map((role) => role.name).join(', ') || '-';
      },
    },
    {
      title: t('tables.actions'),
      key: 'actions',
      width: 200,
      render: (_, record: User) => (
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
      <PageTitle>User Management</PageTitle>
      <S.Card>
        <S.Header>
          <S.Title>Users</S.Title>
          <BaseButton type="primary" onClick={handleCreate}>
            {t('common.create')} User
          </BaseButton>
        </S.Header>
        <BaseTable
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: total,
            showSizeChanger: true,
            showTotal: (value) => `Total ${value} users`,
          }}
          onChange={(pageConfig) => {
            handleTableChange(pageConfig.current || 1, pageConfig.pageSize || 10);
          }}
        />
      </S.Card>

      <BaseModal
        title={editingUser ? 'Edit User' : 'Create User'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <BaseForm form={form} layout="vertical">
          <BaseForm.Item
            name="email"
            label={t('common.email')}
            rules={[
              { required: true, message: 'Email is required' },
              { type: 'email', message: 'Invalid email format' },
            ]}
          >
            <BaseInput placeholder="Email" disabled={!!editingUser} />
          </BaseForm.Item>

          <BaseForm.Item name="full_name" label={t('common.name')}>
            <BaseInput placeholder="Full Name" />
          </BaseForm.Item>

          <BaseForm.Item
            name="password"
            label={t('common.password')}
            rules={!editingUser ? [{ required: true, message: 'Password is required' }] : []}
          >
            <BaseInput.Password placeholder={editingUser ? 'Leave blank to keep current password' : 'Password'} />
          </BaseForm.Item>

          <BaseForm.Item name="is_active" valuePropName="checked">
            <BaseSwitch checkedChildren="Active" unCheckedChildren="Inactive" />
            <S.Label>Active</S.Label>
          </BaseForm.Item>

          <BaseForm.Item name="is_superuser" valuePropName="checked">
            <BaseSwitch checkedChildren="Yes" unCheckedChildren="No" />
            <S.Label>Superuser</S.Label>
          </BaseForm.Item>
        </BaseForm>
      </BaseModal>
    </>
  );
};

export default UserManagementPage;




