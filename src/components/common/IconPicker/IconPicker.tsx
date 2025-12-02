import React, { useState, useMemo } from 'react';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';
import { BaseTabs } from '@app/components/common/BaseTabs/BaseTabs';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import * as Icons from '@ant-design/icons';
import * as S from './IconPicker.styles';

interface IconPickerProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

type IconCategoryKey = 'outlined' | 'filled' | 'twoTone';
type IconDictionary = Record<IconCategoryKey, string[]>;
type AntdIconComponent = React.ComponentType<Record<string, unknown>>;

// 图标分类配置
const iconCategories: Array<{ key: IconCategoryKey; label: string; suffix: string }> = [
  { key: 'outlined', label: '线框图标', suffix: 'Outlined' },
  { key: 'filled', label: '实心图标', suffix: 'Filled' },
  { key: 'twoTone', label: '双色图标', suffix: 'TwoTone' },
];

const isIconComponent = (component: unknown): component is AntdIconComponent =>
  Boolean(component) && (typeof component === 'function' || typeof component === 'object');

const getIconComponent = (iconName: string): AntdIconComponent | null => {
  const icon = Icons[iconName as keyof typeof Icons];
  return isIconComponent(icon) ? (icon as AntdIconComponent) : null;
};

// 自动获取所有图标并按类型分类
const getAllIconsByCategory = (): IconDictionary => {
  const iconMap: IconDictionary = {
    outlined: [],
    filled: [],
    twoTone: [],
  };

  (Object.keys(Icons) as Array<keyof typeof Icons>).forEach((iconName) => {
    const IconComponent = Icons[iconName];
    if (isIconComponent(IconComponent) && iconName.endsWith('Outlined')) {
      iconMap.outlined.push(iconName);
    } else if (isIconComponent(IconComponent) && iconName.endsWith('Filled')) {
      iconMap.filled.push(iconName);
    } else if (isIconComponent(IconComponent) && iconName.endsWith('TwoTone')) {
      iconMap.twoTone.push(iconName);
    }
  });

  (Object.keys(iconMap) as IconCategoryKey[]).forEach((key) => {
    iconMap[key].sort();
  });

  return iconMap;
};

export const IconPicker: React.FC<IconPickerProps> = ({ value, onChange, placeholder = '点击选择图标' }) => {
  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<IconCategoryKey>('outlined');

  const allIcons = useMemo<IconDictionary>(() => getAllIconsByCategory(), []);

  const handleIconClick = (iconName: string) => {
    onChange?.(iconName);
    setVisible(false);
  };

  const renderIcon = (iconName: string) => {
    const IconComponent = getIconComponent(iconName);
    if (!IconComponent) return null;
    return React.createElement(IconComponent);
  };

  const renderIconGrid = (icons: string[]) => (
    <S.IconGrid>
      {icons.map((iconName) => {
        const IconComponent = getIconComponent(iconName);
        if (!IconComponent) return null;

        return (
          <S.IconItem
            key={iconName}
            onClick={() => handleIconClick(iconName)}
            $selected={value === iconName}
            title={iconName}
          >
            <S.IconWrapper>{React.createElement(IconComponent)}</S.IconWrapper>
            <S.IconName>{iconName}</S.IconName>
          </S.IconItem>
        );
      })}
    </S.IconGrid>
  );

  const tabItems = iconCategories.map((category) => ({
    key: category.key,
    label: category.label,
    children: renderIconGrid(allIcons[category.key] || []),
  }));

  return (
    <div style={{ width: '100%' }}>
      <BaseInput
        value={value || ''}
        placeholder={placeholder}
        readOnly
        suffix={value ? renderIcon(value) : null}
        onClick={() => setVisible(true)}
        style={{ cursor: 'pointer' }}
      />

      <BaseModal
        title="选择图标"
        open={visible}
        onCancel={() => setVisible(false)}
        footer={[
          <BaseButton key="cancel" onClick={() => setVisible(false)}>
            取消
          </BaseButton>,
        ]}
        width={800}
        style={{ top: 50 }}
      >
        <BaseTabs
          activeKey={activeTab}
          onChange={(key: string) => setActiveTab(key as IconCategoryKey)}
          items={tabItems}
        />
      </BaseModal>
    </div>
  );
};
