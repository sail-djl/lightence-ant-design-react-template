import React, { useEffect, useState, useCallback } from 'react';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';
import { BaseSelect } from '@app/components/common/selects/BaseSelect/BaseSelect';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { BaseSwitch } from '@app/components/common/BaseSwitch/BaseSwitch';
import { notificationController } from '@app/controllers/notificationController';
import { SystemConfig, createSystemConfig, updateSystemConfig, SystemConfigCreate, SystemConfigUpdate } from '@app/api/systemconfig.api';
import {
  CONFIG_CATEGORY_OPTIONS_FOR_FORM,
  getConfigTypesByCategory,
} from '../constants';
import { JsonPreview } from './JsonPreview';
import * as S from './ConfigFormModal.styles';

interface ConfigFormModalProps {
  visible: boolean;
  editingConfig: SystemConfig | null;
  onCancel: () => void;
  onSuccess: () => void;
}

export const ConfigFormModal: React.FC<ConfigFormModalProps> = ({
  visible,
  editingConfig,
  onCancel,
  onSuccess,
}) => {
  const [form] = BaseForm.useForm();
  const [configCategory, setConfigCategory] = useState<string>('');
  const [configType, setConfigType] = useState<string>('');
  const [jsonConfig, setJsonConfig] = useState<Record<string, any>>({});
  
  // 根据选中的分类动态获取类型选项
  const configTypeOptions = configCategory ? getConfigTypesByCategory(configCategory) : [];

  useEffect(() => {
    if (visible) {
      if (editingConfig) {
        form.setFieldsValue({
          config_category: editingConfig.config_category,
          config_type: editingConfig.config_type,
          config_key: editingConfig.config_key,
          description: editingConfig.description,
          is_active: editingConfig.is_active,
          is_default: editingConfig.is_default,
          version: editingConfig.version,
        });
        setConfigCategory(editingConfig.config_category);
        setConfigType(editingConfig.config_type);
        setJsonConfig(editingConfig.config_value);
      } else {
        form.resetFields();
        form.setFieldsValue({
          config_key: 'default',
          is_active: true,
          is_default: false,
          version: 1,
        });
        setConfigCategory('');
        setConfigType('');
        setJsonConfig({});
      }
    }
  }, [visible, editingConfig, form]);

  const handleConfigCategoryChange = (value: unknown) => {
    const category = value as string;
    setConfigCategory(category);
    // 当分类改变时，清空类型选择和JSON配置
    form.setFieldsValue({ config_type: undefined, config_value: {} });
    setConfigType('');
    setJsonConfig({});
  };

  const handleConfigTypeChange = (value: unknown) => {
    setConfigType(value as string);
    form.setFieldsValue({ config_value: {} });
    setJsonConfig({});
  };

  const handleFormValuesChange = useCallback(() => {
    // JSON预览会通过手动编辑自动更新
  }, []);

  const handleJsonChange = (value: Record<string, any>) => {
    setJsonConfig(value);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (!configCategory) {
        notificationController.error({ message: '请选择配置分类' });
        return;
      }

      if (!configType) {
        notificationController.error({ message: '请选择配置类型' });
        return;
      }

      const payload: SystemConfigCreate | SystemConfigUpdate = {
        config_category: configCategory,
        config_type: configType,
        config_key: values.config_key || 'default',
        config_value: jsonConfig,
        is_active: values.is_active ?? true,
        is_default: values.is_default ?? false,
        description: values.description,
        version: values.version || 1,
      };

      if (editingConfig) {
        await updateSystemConfig(editingConfig.id, payload as SystemConfigUpdate);
        notificationController.success({ message: '配置已更新' });
      } else {
        await createSystemConfig(payload as SystemConfigCreate);
        notificationController.success({ message: '配置已创建' });
      }

      onSuccess();
    } catch (error: any) {
      notificationController.error({
        message: error?.message || '保存配置失败',
      });
    }
  };

  return (
    <BaseModal
      title={editingConfig ? '编辑配置' : '新增配置'}
      open={visible}
      onCancel={onCancel}
      width={1600}
      footer={
        <BaseSpace>
          <BaseButton onClick={onCancel}>取消</BaseButton>
          <BaseButton type="primary" onClick={handleSubmit}>
            保存
          </BaseButton>
        </BaseSpace>
      }
    >
      <S.ModalContent>
        <S.ConfigFormArea>
          <BaseForm form={form} layout="vertical" onValuesChange={handleFormValuesChange}>
            <S.FormCard>
              <S.FormCardTitle>基础信息</S.FormCardTitle>
              <BaseForm.Item
                name="config_category"
                label="配置分类"
                rules={[{ required: true, message: '请选择配置分类' }]}
              >
                <BaseSelect
                  options={CONFIG_CATEGORY_OPTIONS_FOR_FORM}
                  placeholder="请选择配置分类"
                  onChange={handleConfigCategoryChange}
                />
              </BaseForm.Item>
              <BaseForm.Item
                name="config_type"
                label="配置类型"
                rules={[{ required: true, message: '请选择配置类型' }]}
              >
                <BaseSelect
                  options={configTypeOptions}
                  placeholder={configCategory ? '请选择配置类型' : '请先选择配置分类'}
                  onChange={handleConfigTypeChange}
                  disabled={!configCategory}
                />
              </BaseForm.Item>
              <BaseForm.Item
                name="config_key"
                label="配置键"
                rules={[{ required: true, message: '请输入配置键' }]}
              >
                <BaseInput placeholder="default" />
              </BaseForm.Item>
              <BaseForm.Item name="description" label="描述">
                <BaseInput.TextArea rows={2} placeholder="请输入配置描述" />
              </BaseForm.Item>
              <BaseForm.Item name="version" label="版本">
                <BaseInput type="number" placeholder="1" />
              </BaseForm.Item>
              <BaseForm.Item name="is_default" valuePropName="checked">
                <BaseSwitch checkedChildren="设为默认配置" unCheckedChildren="普通配置" />
              </BaseForm.Item>
              <BaseForm.Item name="is_active" valuePropName="checked">
                <BaseSwitch checkedChildren="启用" unCheckedChildren="禁用" />
              </BaseForm.Item>
            </S.FormCard>
            <S.FormCard>
              <S.FormCardTitle>配置值（JSON）</S.FormCardTitle>
              <BaseForm.Item name="config_value" label="">
                <BaseInput.TextArea
                  rows={15}
                  placeholder='请输入JSON格式的配置值，例如：{"key": "value"} 或 [{"id": "1", "name": "test"}]'
                  onChange={(e) => {
                    try {
                      const value = e.target.value ? JSON.parse(e.target.value) : {};
                      handleJsonChange(value);
                    } catch (error) {
                      // 忽略JSON解析错误，用户可能正在输入
                    }
                  }}
                  value={JSON.stringify(jsonConfig, null, 2)}
                />
              </BaseForm.Item>
            </S.FormCard>
          </BaseForm>
        </S.ConfigFormArea>
        <S.JsonPreviewArea>
          <S.JsonPreviewHeader>JSON 配置预览</S.JsonPreviewHeader>
          <JsonPreview
            config={{
              config_category: configCategory,
              config_type: configType,
              config_key: form.getFieldValue('config_key') || 'default',
              config_value: jsonConfig,
              is_active: form.getFieldValue('is_active') ?? true,
              is_default: form.getFieldValue('is_default') ?? false,
              description: form.getFieldValue('description'),
              version: form.getFieldValue('version') || 1,
            }}
          />
        </S.JsonPreviewArea>
      </S.ModalContent>
    </BaseModal>
  );
};
