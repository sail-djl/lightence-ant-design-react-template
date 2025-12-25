import React, { useEffect, useState, useCallback } from 'react';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';
import { BaseSelect } from '@app/components/common/selects/BaseSelect/BaseSelect';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { BaseSwitch } from '@app/components/common/BaseSwitch/BaseSwitch';
import { notificationController } from '@app/controllers/notificationController';
import { UserConfig, createUserConfig, updateUserConfig, UserConfigCreate, UserConfigUpdate } from '@app/api/userconfig.api';
import { ConfigFormCards } from './ConfigFormCards';
import { JsonPreview } from './JsonPreview';
import * as S from './ConfigFormModal.styles';

interface ConfigFormModalProps {
  visible: boolean;
  editingConfig: UserConfig | null;
  onCancel: () => void;
  onSuccess: () => void;
}

const MODULE_OPTIONS = [
  { label: '看板模块', value: 'dashboard' },
  { label: '指数模块', value: 'index' },
  { label: 'ETF模块', value: 'etf' },
  { label: '基金模块', value: 'fund' },
  { label: '股票模块', value: 'stock' },
  { label: '系统模块', value: 'system' },
];

const CONFIG_TYPE_OPTIONS = [
  { label: '看板指数概览', value: 'dashboard_index_overview' },
  { label: '指数日线查询', value: 'index_daily_query' },
  { label: '指数周线查询', value: 'index_weekly_query' },
  { label: '大盘指数每日指标查询', value: 'index_dailybasic_query' },
  { label: '国际指数查询', value: 'index_global_query' },
  { label: '指数技术因子查询', value: 'index_factor_query' },
  { label: '申万行业日线查询', value: 'sw_daily_query' },
  { label: '指数同步设置', value: 'index_sync_settings' },
];

export const ConfigFormModal: React.FC<ConfigFormModalProps> = ({
  visible,
  editingConfig,
  onCancel,
  onSuccess,
}) => {
  const [form] = BaseForm.useForm();
  const [configType, setConfigType] = useState<string>('');
  const [jsonConfig, setJsonConfig] = useState<Record<string, any>>({});

  useEffect(() => {
    if (visible) {
      if (editingConfig) {
        form.setFieldsValue({
          module: editingConfig.module,
          config_type: editingConfig.config_type,
          config_key: editingConfig.config_key,
          description: editingConfig.description,
          is_active: editingConfig.is_active,
          is_default: editingConfig.is_default,
        });
        setConfigType(editingConfig.config_type);
        setJsonConfig(editingConfig.config_value);
      } else {
        form.resetFields();
        form.setFieldsValue({
          config_key: 'default',
          is_active: true,
          is_default: false,
        });
        setConfigType('');
        setJsonConfig({});
      }
    }
  }, [visible, editingConfig, form]);

  const handleConfigTypeChange = (value: unknown) => {
    setConfigType(value as string);
    form.setFieldsValue({ config_value: {} });
    setJsonConfig({});
  };

  const handleFormValuesChange = useCallback(() => {
    // JSON预览会通过ConfigFormCards的onConfigValueChange自动更新
  }, []);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (!configType) {
        notificationController.error({ message: '请选择配置类型' });
        return;
      }

      const payload: UserConfigCreate | UserConfigUpdate = {
        module: values.module,
        config_type: configType,
        config_key: values.config_key || 'default',
        config_value: jsonConfig,
        is_active: values.is_active ?? true,
        is_default: values.is_default ?? false,
        description: values.description,
      };

      if (editingConfig) {
        await updateUserConfig(editingConfig.id, payload as UserConfigUpdate);
        notificationController.success({ message: '配置已更新' });
      } else {
        await createUserConfig(payload as UserConfigCreate);
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
                name="module"
                label="模块"
                rules={[{ required: false, message: '请选择模块' }]}
              >
                <BaseSelect options={MODULE_OPTIONS} placeholder="请选择模块" />
              </BaseForm.Item>
              <BaseForm.Item
                name="config_type"
                label="配置类型"
                rules={[{ required: true, message: '请选择配置类型' }]}
              >
                <BaseSelect
                  options={CONFIG_TYPE_OPTIONS}
                  placeholder="请选择配置类型"
                  onChange={handleConfigTypeChange}
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
              <BaseForm.Item name="is_default" valuePropName="checked">
                <BaseSwitch checkedChildren="设为默认配置" unCheckedChildren="普通配置" />
              </BaseForm.Item>
              <BaseForm.Item name="is_active" valuePropName="checked">
                <BaseSwitch checkedChildren="启用" unCheckedChildren="禁用" />
              </BaseForm.Item>
            </S.FormCard>
            {configType && (
              <ConfigFormCards
                configType={configType}
                initialValue={editingConfig?.config_value || jsonConfig}
                onConfigValueChange={(value) => {
                  setJsonConfig(value);
                  handleFormValuesChange();
                }}
              />
            )}
          </BaseForm>
        </S.ConfigFormArea>
        <S.JsonPreviewArea>
          <S.JsonPreviewHeader>JSON 配置预览</S.JsonPreviewHeader>
          <JsonPreview
            config={{
              module: form.getFieldValue('module'),
              config_type: configType,
              config_key: form.getFieldValue('config_key') || 'default',
              config_value: jsonConfig,
              is_active: form.getFieldValue('is_active') ?? true,
              is_default: form.getFieldValue('is_default') ?? false,
              description: form.getFieldValue('description'),
            }}
          />
        </S.JsonPreviewArea>
      </S.ModalContent>
    </BaseModal>
  );
};

