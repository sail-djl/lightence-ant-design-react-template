/**
 * 系统配置常量定义
 * 用于统一管理配置分类和配置类型的选项
 * 
 * 配置分类与配置类型是 1-n 关系（一个分类包含多个类型）
 */

// 配置选项类型
export interface ConfigOption {
  label: string;
  value: string;
}

// 配置分类标签映射
const CATEGORY_LABEL_MAP: Record<string, string> = {
  market: '市场配置',
  strategy: '策略配置',
  rule: '规则配置',
  template: '模板配置',
  system: '系统配置',
};

// 配置分类与配置类型的 1-n 关系映射
// 格式：{ 分类值: [类型选项数组] }
export const CONFIG_CATEGORY_TYPE_MAP: Record<string, ConfigOption[]> = {
  market: [
    { label: '市场总览', value: 'market_overview' },
    { label: '利率', value: 'interest_rate' },
    { label: '流动性', value: 'liquidity' },
    { label: '外汇', value: 'forex' },
    { label: '通胀', value: 'inflation' },
    { label: '风险', value: 'risk' },
    { label: '结构', value: 'structure' },
  ],
  // 其他分类可以根据需要添加
  // strategy: [
  //   { label: '策略规则', value: 'strategy_rules' },
  //   { label: '因子定义', value: 'factor_definitions' },
  //   { label: '机器人配置', value: 'robot_config' },
  // ],
  // rule: [
  //   { label: '验证规则', value: 'validation_rules' },
  //   { label: '计算规则', value: 'calculation_rules' },
  // ],
  // template: [
  //   { label: '报表模板', value: 'report_templates' },
  //   { label: '通知模板', value: 'notification_templates' },
  // ],
  // system: [
  //   { label: '系统设置', value: 'system_settings' },
  //   { label: 'API配置', value: 'api_config' },
  // ],
};

// 基础配置分类选项（从映射的key生成，不含"全部"）
export const BASE_CONFIG_CATEGORY_OPTIONS: ConfigOption[] = Object.keys(CONFIG_CATEGORY_TYPE_MAP).map(
  (key) => ({
    label: CATEGORY_LABEL_MAP[key] || key,
    value: key,
  })
);

// 基础配置类型选项（所有类型的扁平化，不含"全部"）
export const BASE_CONFIG_TYPE_OPTIONS: ConfigOption[] = Object.values(CONFIG_CATEGORY_TYPE_MAP).flat();

// 用于过滤的配置分类选项（含"全部"）
export const CONFIG_CATEGORY_OPTIONS_FOR_FILTER: ConfigOption[] = [
  { label: '全部分类', value: '' },
  ...BASE_CONFIG_CATEGORY_OPTIONS,
];

// 用于过滤的配置类型选项（含"全部"）
export const CONFIG_TYPE_OPTIONS_FOR_FILTER: ConfigOption[] = [
  { label: '全部类型', value: '' },
  ...BASE_CONFIG_TYPE_OPTIONS,
];

// 用于表单选择的配置分类选项（不含"全部"）
export const CONFIG_CATEGORY_OPTIONS_FOR_FORM: ConfigOption[] = BASE_CONFIG_CATEGORY_OPTIONS;

// 用于表单选择的配置类型选项（不含"全部"）
// 注意：在表单中应该使用 getConfigTypesByCategory 函数根据选中的分类动态获取
export const CONFIG_TYPE_OPTIONS_FOR_FORM: ConfigOption[] = BASE_CONFIG_TYPE_OPTIONS;

/**
 * 根据配置分类获取对应的配置类型选项
 * @param category 配置分类值
 * @returns 配置类型选项数组
 */
export const getConfigTypesByCategory = (category: string): ConfigOption[] => {
  if (!category) {
    return BASE_CONFIG_TYPE_OPTIONS;
  }
  return CONFIG_CATEGORY_TYPE_MAP[category] || [];
};

/**
 * 根据配置类型获取所属的配置分类
 * @param configType 配置类型值
 * @returns 配置分类值，如果找不到则返回 undefined
 */
export const getCategoryByConfigType = (configType: string): string | undefined => {
  for (const [category, types] of Object.entries(CONFIG_CATEGORY_TYPE_MAP)) {
    if (types.some((type) => type.value === configType)) {
      return category;
    }
  }
  return undefined;
};
