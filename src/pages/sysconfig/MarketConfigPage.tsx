import React, { useState, useEffect } from 'react';
import { Input, Select, Typography } from 'antd';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import {
  Wrapper,
  PageHeader,
  PageTitle as StyledPageTitle,
  ActionBar,
  ConfigSection,
  SectionTitle,
  SectionDescription,
  ConfigGrid,
  FormItem,
  FormLabel,
  FormHint,
  PhaseCard,
  PhaseHeader,
  PhaseName,
  PhaseTag,
  ConstraintTable,
  JsonPreview,
  PermissionRuleRow,
  PermissionLabel,
  TemplatePreview,
  AnchorMenu,
  AnchorLink,
  ViewAllLink,
} from './MarketConfigPage.styles';
import {
  mockMarketDefinition,
  mockPhaseDefinitions,
  mockConstraintDimensions,
  mockMetricMappingRules,
  mockPermissionRules,
  mockTextTemplates,
} from './mockData';

const { TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;

/**
 * 市场配置页面
 */
const MarketConfigPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('section-market-def');
  const [marketDef, setMarketDef] = useState(mockMarketDefinition);
  const [phases, setPhases] = useState(mockPhaseDefinitions);
  const [mappingRules, setMappingRules] = useState(JSON.stringify(mockMetricMappingRules, null, 2));

  // 监听滚动，更新锚点菜单高亮
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('[id^="section-"]');
      let current = '';
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 150) {
          current = section.id;
        }
      });
      if (current) {
        setActiveSection(current);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSave = () => {
    // TODO: 保存配置
    console.log('保存配置', { marketDef, phases, mappingRules });
  };

  const handleReset = () => {
    setMarketDef(mockMarketDefinition);
    setPhases(mockPhaseDefinitions);
    setMappingRules(JSON.stringify(mockMetricMappingRules, null, 2));
  };

  const constraintColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 120,
    },
    {
      title: '中文名',
      dataIndex: 'nameZh',
      key: 'nameZh',
      width: 120,
    },
    {
      title: '核心问题 (Core Question)',
      dataIndex: 'coreQuestion',
      key: 'coreQuestion',
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: () => (
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            // TODO: 编辑约束维度
            console.log('编辑约束维度');
          }}
        >
          编辑
        </a>
      ),
    },
  ];

  return (
    <>
      <PageTitle>市场配置</PageTitle>
      <Wrapper>
        <PageHeader>
          <StyledPageTitle>市场配置 (Market Config)</StyledPageTitle>
          <ActionBar>
            <BaseButton onClick={handleReset}>重置</BaseButton>
            <BaseButton type="primary" onClick={handleSave}>
              保存配置
            </BaseButton>
          </ActionBar>
        </PageHeader>

        {/* 1. 市场定义 */}
        <ConfigSection id="section-market-def">
          <SectionTitle>1. 市场定义 (Market Definition)</SectionTitle>
          <SectionDescription>定义系统支持的市场范围及基础口径。</SectionDescription>
          <ConfigGrid>
            <FormItem>
              <FormLabel>核心市场 (Primary Market)</FormLabel>
              <Select
                value={marketDef.primaryMarket}
                onChange={(value) => setMarketDef({ ...marketDef, primaryMarket: value })}
                style={{ width: '100%' }}
              >
                <Option value="CN_A">中国 A 股 (CN_A)</Option>
                <Option value="US">美股 (US)</Option>
              </Select>
            </FormItem>
            <FormItem>
              <FormLabel>指数锚点 (Default Anchors)</FormLabel>
              <Input
                value={marketDef.defaultAnchors}
                onChange={(e) => setMarketDef({ ...marketDef, defaultAnchors: e.target.value })}
              />
              <FormHint>逗号分隔，用于首页指数快照</FormHint>
            </FormItem>
          </ConfigGrid>
        </ConfigSection>

        {/* 2. Phase 定义 */}
        <ConfigSection id="section-phase-def">
          <SectionTitle>2. Phase 定义 (Market Phases)</SectionTitle>
          <SectionDescription>定义市场周期的四个阶段及其特征描述。</SectionDescription>
          <div>
            {phases.map((phase) => (
              <PhaseCard key={phase.id} $isActive={phase.isActive}>
                <PhaseHeader>
                  <PhaseName>{phase.name}</PhaseName>
                  <PhaseTag>{phase.tag}</PhaseTag>
                </PhaseHeader>
                <TextArea
                  rows={2}
                  value={phase.description}
                  onChange={(e) => {
                    const updated = phases.map((p) =>
                      p.id === phase.id ? { ...p, description: e.target.value } : p,
                    );
                    setPhases(updated);
                  }}
                />
              </PhaseCard>
            ))}
          </div>
        </ConfigSection>

        {/* 3. 约束维度定义 */}
        <ConfigSection id="section-constraints">
          <SectionTitle>3. 约束维度定义 (Constraint Dimensions)</SectionTitle>
          <SectionDescription>六大雷达维度的元数据定义。</SectionDescription>
          <ConstraintTable>
            <thead>
              <tr>
                <th>ID</th>
                <th>中文名</th>
                <th>核心问题 (Core Question)</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {mockConstraintDimensions.map((dimension) => (
                <tr key={dimension.id}>
                  <td>{dimension.id}</td>
                  <td>{dimension.nameZh}</td>
                  <td>{dimension.coreQuestion}</td>
                  <td>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        // TODO: 编辑约束维度
                        console.log('编辑约束维度', dimension.id);
                      }}
                    >
                      编辑
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </ConstraintTable>
          <ViewAllLink
            onClick={() => {
              // TODO: 查看全部维度
              console.log('查看全部 6 个维度');
            }}
          >
            查看全部 6 个维度...
          </ViewAllLink>
        </ConfigSection>

        {/* 4. 指标映射规则 */}
        <ConfigSection id="section-mapping">
          <SectionTitle>4. 指标映射规则 (Metric Mapping Rules)</SectionTitle>
          <SectionDescription>定义原始指标如何映射为定性状态。</SectionDescription>
          <JsonPreview>{mappingRules}</JsonPreview>
          <div style={{ marginTop: '8px', textAlign: 'right' }}>
            <BaseButton
              onClick={() => {
                // TODO: 编辑 JSON
                console.log('编辑 JSON');
              }}
            >
              编辑 JSON
            </BaseButton>
          </div>
        </ConfigSection>

        {/* 5. 环境许可度规则 */}
        <ConfigSection id="section-permission">
          <SectionTitle>5. 环境许可度规则 (Permission Rules)</SectionTitle>
          <SectionDescription>根据 Phase 和雷达分数决定仓位上限。</SectionDescription>
          <ConfigGrid>
            {mockPermissionRules.map((rule) => (
              <FormItem key={rule.level}>
                <FormLabel>
                  {rule.level === 'high' && '高许可 (High Permission)'}
                  {rule.level === 'medium' && '中许可 (Medium Permission)'}
                  {rule.level === 'low' && '低许可 (Low Permission)'}
                </FormLabel>
                <PermissionRuleRow>
                  <PermissionLabel>条件:</PermissionLabel>
                  <Input value={rule.condition} style={{ flex: 1 }} readOnly />
                  <PermissionLabel>仓位:</PermissionLabel>
                  <Input value={rule.positionRange} style={{ width: 100 }} readOnly />
                </PermissionRuleRow>
              </FormItem>
            ))}
          </ConfigGrid>
        </ConfigSection>

        {/* 6. 文案模板 */}
        <ConfigSection id="section-templates">
          <SectionTitle>6. 文案模板 (Text Templates)</SectionTitle>
          <SectionDescription>系统生成的标准化文案口径。</SectionDescription>
          {mockTextTemplates.map((template, idx) => (
            <FormItem key={idx}>
              <FormLabel>{template.name}</FormLabel>
              <Input value={template.template} readOnly />
              {template.preview && <TemplatePreview>预览：{template.preview}</TemplatePreview>}
            </FormItem>
          ))}
        </ConfigSection>
      </Wrapper>

      {/* 锚点菜单 */}
      <AnchorMenu>
        <AnchorLink
          href="#section-market-def"
          $active={activeSection === 'section-market-def'}
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('section-market-def')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          1. 市场定义
        </AnchorLink>
        <AnchorLink
          href="#section-phase-def"
          $active={activeSection === 'section-phase-def'}
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('section-phase-def')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          2. Phase 定义
        </AnchorLink>
        <AnchorLink
          href="#section-constraints"
          $active={activeSection === 'section-constraints'}
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('section-constraints')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          3. 约束维度
        </AnchorLink>
        <AnchorLink
          href="#section-mapping"
          $active={activeSection === 'section-mapping'}
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('section-mapping')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          4. 映射规则
        </AnchorLink>
        <AnchorLink
          href="#section-permission"
          $active={activeSection === 'section-permission'}
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('section-permission')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          5. 许可度规则
        </AnchorLink>
        <AnchorLink
          href="#section-templates"
          $active={activeSection === 'section-templates'}
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('section-templates')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          6. 文案模板
        </AnchorLink>
      </AnchorMenu>
    </>
  );
};

export default MarketConfigPage;
