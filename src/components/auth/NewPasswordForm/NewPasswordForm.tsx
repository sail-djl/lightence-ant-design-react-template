import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { notificationController } from '@app/controllers/notificationController';
import { useAppDispatch } from '@app/hooks/reduxHooks';
import { doSetNewPassword } from '@app/store/slices/authSlice';
import * as S from './NewPasswordForm.styles';
import * as Auth from '@app/components/layouts/AuthLayout/AuthLayout.styles';

interface NewPasswordFormData {
  password: string;
  confirmPassword: string;
}

const initStates = {
  password: 'new-password',
  confirmPassword: 'new-password',
};

export const NewPasswordForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isLoading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState<string | null>(null);

  // 从 URL 查询参数中获取 token（FastAPI 密码重置链接会包含 token）
  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      // 如果没有 token，显示错误并跳转
      notificationController.error({
        message: t('newPassword.tokenMissing'),
        description: t('newPassword.tokenMissingDescription'),
      });
      navigate('/auth/forgot-password');
    }
  }, [searchParams, navigate, t]);

  const handleSubmit = (values: NewPasswordFormData) => {
    if (!token) {
      notificationController.error({ message: t('newPassword.tokenMissing') });
      return;
    }

    setLoading(true);
    dispatch(doSetNewPassword({ newPassword: values.password, token }))
      .unwrap()
      .then(() => {
        navigate('/auth/login');
        notificationController.success({
          message: t('newPassword.successMessage'),
          description: t('newPassword.successDescription'),
        });
      })
      .catch((err) => {
        notificationController.error({ message: err.message });
        setLoading(false);
      });
  };

  return (
    <Auth.FormWrapper>
      <BaseForm layout="vertical" onFinish={handleSubmit} requiredMark="optional" initialValues={initStates}>
        <Auth.BackWrapper onClick={() => navigate(-1)}>
          <Auth.BackIcon />
          {t('common.back')}
        </Auth.BackWrapper>
        <Auth.FormTitle>{t('newPassword.title')}</Auth.FormTitle>
        <S.Description>{t('newPassword.description')}</S.Description>
        <Auth.FormItem
          name="password"
          label={t('common.password')}
          rules={[{ required: true, message: t('common.requiredField') }]}
        >
          <Auth.FormInputPassword placeholder={t('common.password')} />
        </Auth.FormItem>
        <Auth.FormItem
          name="confirmPassword"
          label={t('common.confirmPassword')}
          dependencies={['password']}
          rules={[
            { required: true, message: t('common.requiredField') },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error(t('common.confirmPasswordError')));
              },
            }),
          ]}
          hasFeedback
        >
          <Auth.FormInputPassword placeholder={t('common.confirmPassword')} />
        </Auth.FormItem>
        <BaseForm.Item noStyle>
          <S.SubmitButton type="primary" htmlType="submit" loading={isLoading}>
            {t('common.resetPassword')}
          </S.SubmitButton>
        </BaseForm.Item>
      </BaseForm>
    </Auth.FormWrapper>
  );
};
