// 市场配置数据类型定义

export interface MarketDefinition {
  primaryMarket: string;
  defaultAnchors: string;
}

export interface PhaseDefinition {
  id: string;
  name: string;
  description: string;
  tag: string;
  isActive?: boolean;
}

export interface ConstraintDimension {
  id: string;
  nameZh: string;
  coreQuestion: string;
}

export interface MetricMappingRule {
  metric: string;
  conditions: Array<{
    range: string;
    status: string;
    score?: number;
    desc?: string;
  }>;
}

export interface PermissionRule {
  level: 'high' | 'medium' | 'low';
  condition: string;
  positionRange: string;
}

export interface TextTemplate {
  name: string;
  template: string;
  preview?: string;
}

export interface MarketConfig {
  marketDefinition: MarketDefinition;
  phaseDefinitions: PhaseDefinition[];
  constraintDimensions: ConstraintDimension[];
  metricMappingRules: MetricMappingRule[];
  permissionRules: PermissionRule[];
  textTemplates: TextTemplate[];
}
