import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { BaseSelect } from '@app/components/common/selects/BaseSelect/BaseSelect';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';
import { ColumnsType } from 'antd/es/table';
import { IndexClassify, getIndexClassifyList, syncIndexClassify, IndexClassifySyncPayload } from '@app/api/datamarket/index.api';
import { useIndexSync } from '../hooks/useIndexSync';
import { trim } from '../utils';

// 树形节点类型（扩展 IndexClassify，添加 children 属性）
interface TreeNode extends IndexClassify {
  children?: TreeNode[];
}

// 构建树形结构的函数
const buildTree = (data: IndexClassify[]): TreeNode[] => {
  if (!data || data.length === 0) {
    return [];
  }

  // 创建映射表：使用 industry_code 作为 key（因为 parent_code 对应的是 industry_code）
  const mapByIndustryCode = new Map<string, TreeNode>();
  const mapByIndexCode = new Map<string, TreeNode>();
  const roots: TreeNode[] = [];

  // 第一遍遍历：创建所有节点
  data.forEach((item) => {
    const node: TreeNode = { ...item };
    if (item.industry_code) {
      mapByIndustryCode.set(item.industry_code, node);
    }
    mapByIndexCode.set(item.index_code, node);
  });

  // 第二遍遍历：建立父子关系
  data.forEach((item) => {
    const node = mapByIndexCode.get(item.index_code)!;
    const parentCode = item.parent_code;
    
    // 判断是否为根节点：parent_code 为空、undefined、'0' 或 '000000'
    if (!parentCode || parentCode === '0' || parentCode === '000000' || parentCode.trim() === '') {
      // 一级行业（根节点）
      roots.push(node);
    } else {
      // 查找父节点：parent_code 对应的是父节点的 industry_code
      const parent = mapByIndustryCode.get(parentCode);
      
      if (parent) {
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(node);
      } else {
        // 如果找不到父节点，也作为根节点（防止数据不完整）
        roots.push(node);
      }
    }
  });

  // 对每个层级的子节点进行排序（按 index_code）
  const sortChildren = (nodes: TreeNode[]) => {
    nodes.sort((a, b) => {
      // 优先按 industry_code 排序，如果没有则按 index_code
      const codeA = a.industry_code || a.index_code;
      const codeB = b.industry_code || b.index_code;
      return codeA.localeCompare(codeB);
    });
    nodes.forEach((node) => {
      if (node.children && node.children.length > 0) {
        sortChildren(node.children);
      }
    });
  };

  sortChildren(roots);
  
  // 清理空的 children 数组（Ant Design Table 需要 undefined 而不是空数组）
  const cleanEmptyChildren = (nodes: TreeNode[]) => {
    nodes.forEach((node) => {
      if (node.children && node.children.length === 0) {
        delete node.children;
      } else if (node.children && node.children.length > 0) {
        cleanEmptyChildren(node.children);
      }
    });
  };
  
  cleanEmptyChildren(roots);
  return roots;
};

export const IndexClassifyTab: React.FC = () => {
  const [query, setQuery] = useState<{ index_code: string; level?: string; parent_code: string; src: string; keyword: string }>({
    index_code: '',
    level: undefined,
    parent_code: '',
    src: 'SW2021',
    keyword: '',
  });
  const [rows, setRows] = useState<IndexClassify[]>([]);
  const [loading, setLoading] = useState(false);

  // 获取数据（一次性加载所有数据，不分页）
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getIndexClassifyList({
        index_code: trim(query.index_code) || undefined,
        level: query.level,
        parent_code: trim(query.parent_code) || undefined,
        src: query.src,
        keyword: trim(query.keyword) || undefined,
      });
      setRows(res.data);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 将平铺数据转换为树形结构
  const treeData = useMemo(() => {
    return buildTree(rows);
  }, [rows]);

  const { syncOpen, setSyncOpen, syncLoading, syncPayload, setSyncPayload, handleSync } = useIndexSync<
    IndexClassifySyncPayload
  >({
    syncFn: syncIndexClassify,
    onSuccess: () => fetchData(),
  });

  const columns: ColumnsType<TreeNode> = [
    { title: '指数代码', dataIndex: 'index_code', key: 'index_code', align: 'center', width: 120 },
    { title: '行业名称', dataIndex: 'industry_name', key: 'industry_name', align: 'left', width: 200 },
    { title: '行业代码', dataIndex: 'industry_code', key: 'industry_code', align: 'center', width: 120, render: (v: string) => v || '-' },
    {
      title: '行业层级',
      dataIndex: 'level',
      key: 'level',
      align: 'center',
      width: 100,
      render: (v: string) => {
        if (v === 'L1') return '一级行业';
        if (v === 'L2') return '二级行业';
        if (v === 'L3') return '三级行业';
        return v || '-';
      },
    },
    { title: '是否发布', dataIndex: 'is_pub', key: 'is_pub', align: 'center', width: 100, render: (v: string) => (v === '1' ? '是' : '否') },
    { title: '版本', dataIndex: 'src', key: 'src', align: 'center', width: 100, render: (v: string) => v || '-' },
  ];

  return (
    <>
      <BaseSpace style={{ display: 'flex', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <BaseInput
          placeholder="指数代码"
          allowClear
          value={query.index_code}
          onChange={(e) => setQuery((prev) => ({ ...prev, index_code: trim(e.target.value) }))}
          style={{ width: 150 }}
          onPressEnter={() => fetchData()}
        />
        <BaseSelect
          placeholder="行业级别"
          allowClear
          value={query.level}
          onChange={(val) => {
            setQuery((prev) => ({ ...prev, level: val as string | undefined }));
          }}
          options={[
            { value: 'L1', label: '一级行业' },
            { value: 'L2', label: '二级行业' },
            { value: 'L3', label: '三级行业' },
          ]}
          style={{ width: 150 }}
        />
        <BaseInput
          placeholder="父级代码（一级为0）"
          allowClear
          value={query.parent_code}
          onChange={(e) => setQuery((prev) => ({ ...prev, parent_code: trim(e.target.value) }))}
          style={{ width: 150 }}
          onPressEnter={() => fetchData()}
        />
        <BaseSelect
          placeholder="版本"
          value={query.src}
          onChange={(val) => {
            setQuery((prev) => ({ ...prev, src: val as string }));
          }}
          options={[
            { value: 'SW2021', label: '2021版本' },
            { value: 'SW2014', label: '2014版本' },
          ]}
          style={{ width: 150 }}
        />
        <BaseInput
          placeholder="关键词（行业名称）"
          allowClear
          value={query.keyword}
          onChange={(e) => setQuery((prev) => ({ ...prev, keyword: trim(e.target.value) }))}
          style={{ width: 200 }}
          onPressEnter={() => fetchData()}
        />
        <BaseButton onClick={() => fetchData()}>查询</BaseButton>
        <BaseButton
          onClick={() => {
            setQuery({ index_code: '', level: undefined, parent_code: '', src: 'SW2021', keyword: '' });
          }}
        >
          重置
        </BaseButton>
      </BaseSpace>

      <BaseSpace style={{ display: 'flex', marginBottom: '1rem' }}>
        <BaseButton
          type="primary"
          onClick={() => {
            setSyncPayload({
              index_code: query.index_code || undefined,
              level: query.level,
              parent_code: query.parent_code || undefined,
              src: query.src,
            });
            setSyncOpen(true);
          }}
        >
          同步数据
        </BaseButton>
      </BaseSpace>

      <BaseModal
        title="申万行业分类同步"
        open={syncOpen}
        onCancel={() => setSyncOpen(false)}
        confirmLoading={syncLoading}
        onOk={() => handleSync()}
      >
        <BaseForm layout="vertical">
          <BaseForm.Item label="指数代码（可选）">
            <BaseInput
              value={syncPayload.index_code || ''}
              onChange={(e) => setSyncPayload({ ...syncPayload, index_code: trim(e.target.value) || undefined })}
              placeholder="输入指数代码"
            />
          </BaseForm.Item>
          <BaseForm.Item label="行业级别（可选）">
            <BaseSelect
              value={syncPayload.level}
              onChange={(val) => setSyncPayload({ ...syncPayload, level: val as string | undefined })}
              allowClear
              options={[
                { value: 'L1', label: '一级行业' },
                { value: 'L2', label: '二级行业' },
                { value: 'L3', label: '三级行业' },
              ]}
            />
          </BaseForm.Item>
          <BaseForm.Item label="父级代码（可选）">
            <BaseInput
              value={syncPayload.parent_code || ''}
              onChange={(e) => setSyncPayload({ ...syncPayload, parent_code: trim(e.target.value) || undefined })}
              placeholder="输入父级代码（一级为0）"
            />
          </BaseForm.Item>
          <BaseForm.Item label="版本">
            <BaseSelect
              value={syncPayload.src}
              onChange={(val) => setSyncPayload({ ...syncPayload, src: val as string })}
              options={[
                { value: 'SW2021', label: '2021版本' },
                { value: 'SW2014', label: '2014版本' },
              ]}
            />
          </BaseForm.Item>
        </BaseForm>
      </BaseModal>

      <BaseTable
        columns={columns}
        dataSource={treeData}
        rowKey="index_code"
        loading={loading}
        pagination={false}
        defaultExpandAllRows={false}
        scroll={{ y: 800, x: 1000 }}
        indentSize={20}
      />
    </>
  );
};

