// 市场配置 Mock 数据
import type {
  MarketDefinition,
  PhaseDefinition,
  ConstraintDimension,
  MetricMappingRule,
  PermissionRule,
  TextTemplate,
} from './types';

export const mockMarketDefinition: MarketDefinition = {
  primaryMarket: 'CN_A',
  defaultAnchors: '000001.SH, 399006.SZ, 000300.SH',
};

export const mockPhaseDefinitions: PhaseDefinition[] = [
  {
    id: 'P1',
    name: 'Phase 1: 普涨/复苏 (Recovery)',
    description: '特征：流动性充裕，风险偏好回升，大小盘共振上行。建议满仓进攻。',
    tag: 'P1',
  },
  {
    id: 'P2',
    name: 'Phase 2: 震荡/分歧 (Volatility)',
    description: '特征：多空分歧加大，指数区间震荡，题材轮动加快。建议高抛低吸。',
    tag: 'P2',
  },
  {
    id: 'P3',
    name: 'Phase 3: 结构/抱团 (Dispersion)',
    description: '特征：存量博弈，指数失真，资金集中在少数核心资产。建议聚焦主线，放弃杂毛。',
    tag: 'P3',
    isActive: true,
  },
  {
    id: 'P4',
    name: 'Phase 4: 普跌/风险 (Decline)',
    description: '特征：流动性收紧，系统性风险释放，泥沙俱下。建议空仓或防御。',
    tag: 'P4',
  },
];

export const mockConstraintDimensions: ConstraintDimension[] = [
  {
    id: 'Rates',
    nameZh: '利率',
    coreQuestion: '资金价格贵不贵？(Cost of Money)',
  },
  {
    id: 'Liquidity',
    nameZh: '流动性',
    coreQuestion: '钱多不多？(Quantity of Money)',
  },
  {
    id: 'Structure',
    nameZh: '结构',
    coreQuestion: '涨得匀不匀？(Market Breadth)',
  },
  {
    id: 'FX',
    nameZh: '外汇',
    coreQuestion: '汇率压力大不大？(FX Pressure)',
  },
  {
    id: 'Risk',
    nameZh: '风险',
    coreQuestion: '风险定价如何？(Risk Pricing)',
  },
  {
    id: 'Inflation',
    nameZh: '通胀',
    coreQuestion: '成本压力如何？(Cost Pressure)',
  },
];

export const mockMetricMappingRules: MetricMappingRule[] = [
  {
    metric: 'DR007',
    conditions: [
      { range: '< 1.8', status: '宽松', score: 100 },
      { range: '1.8 - 2.2', status: '中性', score: 50 },
      { range: '> 2.2', status: '紧缩', score: 0 },
    ],
  },
  {
    metric: 'M2_SocialFin_Gap',
    conditions: [
      { range: '> 2.0', status: '宽币紧信', desc: '资金淤积' },
      { range: '< -1.0', status: '紧币宽信', desc: '经济过热' },
    ],
  },
];

export const mockPermissionRules: PermissionRule[] = [
  {
    level: 'high',
    condition: 'Phase IN [P1] OR Score > 80',
    positionRange: '75% - 100%',
  },
  {
    level: 'medium',
    condition: 'Phase IN [P2, P3] OR Score > 50',
    positionRange: '25% - 50%',
  },
  {
    level: 'low',
    condition: 'Phase IN [P4] OR Score < 40',
    positionRange: '0% - 25%',
  },
];

export const mockTextTemplates: TextTemplate[] = [
  {
    name: 'Rates 解释模板 (A股口径)',
    template: '资金面{status}，长端{trend} → 对 A 股估值{impact}',
    preview: '资金面宽松，长端稳定 → 对 A 股估值偏友好',
  },
  {
    name: '异动提醒模板',
    template: '{metric_name}快速{direction} ({old_val} → {new_val})，关注{suggestion}',
    preview: '结构扩散指数快速上行 (0.45 → 0.62)，关注低位补涨',
  },
];
