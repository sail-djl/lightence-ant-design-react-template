-- ============================================
-- 通用配置表 (user_config)
-- 用于存储用户的各种配置信息（看板配置、查询配置、同步配置等）
-- 数据库: PostgreSQL
-- Schema: public (默认)
-- ============================================
-- ============================================
-- 0. 删除已存在的表和约束（如果存在）
-- ============================================
-- 删除触发器（在删除表之前）
DROP TRIGGER IF EXISTS trigger_user_config_update_time ON public.user_config;
-- 删除表（CASCADE 会级联删除所有依赖的对象，如索引、约束、外键等）
DROP TABLE IF EXISTS public.user_config CASCADE;
-- ============================================
-- 1. 创建通用配置表
-- ============================================
CREATE TABLE public.user_config (
    -- 主键
    id BIGSERIAL PRIMARY KEY,
    -- 用户ID（关联用户表，NULL表示全局默认配置）
    user_id UUID,
    -- 模块（用于区分不同的功能模块）
    -- 示例值：
    --   'index' - 指数模块
    --   'etf' - ETF模块
    --   'fund' - 基金模块
    --   'stock' - 股票模块
    --   'macro' - 宏观经济模块
    --   'forex' - 外汇模块
    --   'futures' - 期货模块
    --   'dashboard' - 看板模块
    --   'system' - 系统模块
    --   NULL - 通用配置（不限定模块）
    module VARCHAR(50),
    -- 配置类型（用于区分不同的配置场景）
    -- 示例值：
    --   'dashboard_index_overview' - 看板指数概览配置
    --   'index_daily_query' - 指数日线查询默认配置
    --   'index_weekly_query' - 指数周线查询默认配置
    --   'index_dailybasic_query' - 大盘指数每日指标查询配置
    --   'index_global_query' - 国际指数查询配置
    --   'index_factor_query' - 指数技术因子查询配置
    --   'sw_daily_query' - 申万行业日线查询配置
    --   'index_sync_settings' - 指数同步设置配置
    --   'index_display_settings' - 指数显示设置配置
    --   'index_alert_settings' - 指数预警设置配置
    --   等等...
    config_type VARCHAR(100) NOT NULL,
    -- 配置键（配置的唯一标识，同一用户同一类型下唯一）
    -- 示例值：
    --   'default' - 默认配置
    --   'custom_1' - 自定义配置1
    --   'query_preset_1' - 查询预设1
    --   'sync_preset_1' - 同步预设1
    --   等等...
    config_key VARCHAR(100) NOT NULL DEFAULT 'default',
    -- 配置值（JSONB格式，存储灵活的配置数据）
    -- 不同配置类型的数据结构不同，例如：
    -- 
    -- 看板指数概览配置 (dashboard_index_overview):
    --   {
    --     "ts_codes": ["000001.SH", "000300.SH", "000905.SH"],
    --     "sort_order": {"000001.SH": 1, "000300.SH": 2, "000905.SH": 3},
    --     "display_options": {
    --       "show_volume": true,
    --       "show_turnover": true,
    --       "show_pe": true,
    --       "show_pb": true,
    --       "show_ytd": true
    --     }
    --   }
    --
    -- 指数查询默认配置 (index_daily_query):
    --   {
    --     "default_ts_codes": ["000001.SH", "000300.SH"],
    --     "default_date_range": {"start_days": 30, "end_days": 0},
    --     "default_limit": 1000
    --   }
    --
    -- 指数同步设置配置 (index_sync_settings):
    --   {
    --     "auto_sync": false,
    --     "sync_interval": 3600,
    --     "default_date_range": {"start_days": 365, "end_days": 0},
    --     "batch_size": 10
    --   }
    config_value JSONB NOT NULL DEFAULT '{}'::jsonb,
    -- 是否启用（true-启用，false-禁用）
    is_active BOOLEAN DEFAULT TRUE,
    -- 是否为默认配置（每个用户每种配置类型只能有一个默认配置）
    is_default BOOLEAN DEFAULT FALSE,
    -- 配置描述（可选）
    description TEXT,
    -- 配置版本（用于配置迁移和兼容性管理）
    version INTEGER DEFAULT 1,
    -- 系统字段
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- 创建时间
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- 更新时间
);
-- ============================================
-- 2. 表注释
-- ============================================
COMMENT ON TABLE public.user_config IS '通用配置表 - 存储用户的各种配置信息（看板配置、查询配置、同步配置等）';
COMMENT ON COLUMN public.user_config.id IS '主键ID';
COMMENT ON COLUMN public.user_config.user_id IS '用户ID（关联用户表，NULL表示全局默认配置）';
COMMENT ON COLUMN public.user_config.module IS '模块（用于区分不同的功能模块，如index-指数模块、etf-ETF模块、fund-基金模块等，NULL表示通用配置）';
COMMENT ON COLUMN public.user_config.config_type IS '配置类型（用于区分不同的配置场景，如dashboard_index_overview、index_daily_query等）';
COMMENT ON COLUMN public.user_config.config_key IS '配置键（配置的唯一标识，同一用户同一类型下唯一，默认default）';
COMMENT ON COLUMN public.user_config.config_value IS '配置值（JSONB格式，存储灵活的配置数据）';
COMMENT ON COLUMN public.user_config.is_active IS '是否启用（true-启用，false-禁用）';
COMMENT ON COLUMN public.user_config.is_default IS '是否为默认配置（每个用户每种配置类型只能有一个默认配置）';
COMMENT ON COLUMN public.user_config.description IS '配置描述（可选）';
COMMENT ON COLUMN public.user_config.version IS '配置版本（用于配置迁移和兼容性管理）';
COMMENT ON COLUMN public.user_config.created_at IS '创建时间';
COMMENT ON COLUMN public.user_config.updated_at IS '更新时间';
-- ============================================
-- 3. 索引设计
-- ============================================
-- 用户ID索引（用于查询用户的配置）
CREATE INDEX IF NOT EXISTS idx_user_config_user_id ON public.user_config(user_id);
-- 模块索引（用于按模块查询）
CREATE INDEX IF NOT EXISTS idx_user_config_module ON public.user_config(module);
-- 配置类型索引（用于按类型查询）
CREATE INDEX IF NOT EXISTS idx_user_config_config_type ON public.user_config(config_type);
-- 用户+模块+配置类型+配置键唯一索引（确保同一用户同一模块同一类型下配置键唯一）
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_config_user_module_type_key ON public.user_config(user_id, module, config_type, config_key);
-- 默认配置索引（用于快速查找默认配置）
CREATE INDEX IF NOT EXISTS idx_user_config_is_default ON public.user_config(is_default)
WHERE is_default = TRUE;
-- 启用状态索引
CREATE INDEX IF NOT EXISTS idx_user_config_is_active ON public.user_config(is_active)
WHERE is_active = TRUE;
-- 复合索引：用户+模块+配置类型+是否默认（用于查询用户的默认配置）
CREATE INDEX IF NOT EXISTS idx_user_config_user_module_type_default ON public.user_config(user_id, module, config_type, is_default)
WHERE is_default = TRUE;
-- ============================================
-- 4. 触发器：自动更新 updated_at
-- ============================================
CREATE OR REPLACE FUNCTION public.update_user_config_update_time() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = CURRENT_TIMESTAMP;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS trigger_user_config_update_time ON public.user_config;
CREATE TRIGGER trigger_user_config_update_time BEFORE
UPDATE ON public.user_config FOR EACH ROW EXECUTE FUNCTION public.update_user_config_update_time();
-- ============================================
-- 5. 初始化默认配置数据
-- ============================================
-- 看板指数概览默认配置
INSERT INTO public.user_config (
        user_id,
        module,
        config_type,
        config_key,
        config_value,
        is_default,
        description,
        version
    )
VALUES (
        NULL,
        'dashboard',
        'dashboard_index_overview',
        'default',
        '{
       "ts_codes": ["000001.SH", "000300.SH", "000905.SH", "399006.SZ", "000016.SH", "000688.SH"],
       "sort_order": {
         "000001.SH": 1,
         "000300.SH": 2,
         "000905.SH": 3,
         "399006.SZ": 4,
         "000016.SH": 5,
         "000688.SH": 6
       },
       "display_options": {
         "show_volume": true,
         "show_turnover": true,
         "show_pe": true,
         "show_pb": true,
         "show_ytd": true
       }
     }'::jsonb,
        TRUE,
        '默认看板配置：上证指数、沪深300、中证500、创业板指、上证50、科创50',
        1
    );
-- 指数日线查询默认配置
INSERT INTO public.user_config (
        user_id,
        module,
        config_type,
        config_key,
        config_value,
        is_default,
        description,
        version
    )
VALUES (
        NULL,
        'index',
        'index_daily_query',
        'default',
        '{
       "default_ts_codes": [],
       "default_date_range": {
         "start_days": 30,
         "end_days": 0
       },
       "default_limit": 1000
     }'::jsonb,
        TRUE,
        '指数日线查询默认配置',
        1
    );
-- 指数周线查询默认配置
INSERT INTO public.user_config (
        user_id,
        module,
        config_type,
        config_key,
        config_value,
        is_default,
        description,
        version
    )
VALUES (
        NULL,
        'index',
        'index_weekly_query',
        'default',
        '{
       "default_ts_codes": [],
       "default_date_range": {
         "start_days": 90,
         "end_days": 0
       },
       "default_limit": 1000
     }'::jsonb,
        TRUE,
        '指数周线查询默认配置',
        1
    );
-- 指数同步设置默认配置
INSERT INTO public.user_config (
        user_id,
        module,
        config_type,
        config_key,
        config_value,
        is_default,
        description,
        version
    )
VALUES (
        NULL,
        'index',
        'index_sync_settings',
        'default',
        '{
       "auto_sync": false,
       "sync_interval": 3600,
       "default_date_range": {
         "start_days": 365,
         "end_days": 0
       },
       "batch_size": 10
     }'::jsonb,
        TRUE,
        '指数同步设置默认配置',
        1
    );
-- ============================================
-- 6. 使用示例查询
-- ============================================
/*
 -- 查询用户的看板指数概览配置（优先用户配置，如果没有则查询全局默认配置）
 SELECT * FROM public.user_config
 WHERE module = 'dashboard'
 AND config_type = 'dashboard_index_overview'
 AND (
 (user_id = '用户ID' AND is_default = TRUE AND is_active = TRUE)
 OR (user_id IS NULL AND is_default = TRUE AND is_active = TRUE)
 )
 ORDER BY user_id NULLS LAST
 LIMIT 1;
 
 -- 查询用户的所有看板配置
 SELECT * FROM public.user_config
 WHERE module = 'dashboard'
 AND config_type = 'dashboard_index_overview'
 AND (user_id = '用户ID' OR user_id IS NULL)
 AND is_active = TRUE
 ORDER BY is_default DESC, created_at DESC;
 
 -- 查询指定模块的所有配置类型
 SELECT DISTINCT config_type FROM public.user_config
 WHERE module = 'index'
 AND is_active = TRUE
 ORDER BY config_type;
 
 -- 查询所有模块
 SELECT DISTINCT module FROM public.user_config
 WHERE is_active = TRUE
 ORDER BY module;
 
 -- 查询指定模块和配置类型的配置
 SELECT * FROM public.user_config
 WHERE module = 'index'
 AND config_type = 'index_daily_query'
 AND is_default = TRUE
 AND is_active = TRUE;
 
 -- 更新配置值
 UPDATE public.user_config
 SET config_value = '{"ts_codes": ["000001.SH", "000300.SH"]}'::jsonb,
 updated_at = CURRENT_TIMESTAMP
 WHERE id = 1;
 
 -- 设置默认配置（需要先将其他配置的is_default设为false）
 UPDATE public.user_config
 SET is_default = FALSE
 WHERE config_type = 'dashboard_index_overview'
 AND user_id = '用户ID'
 AND is_default = TRUE;
 
 UPDATE public.user_config
 SET is_default = TRUE
 WHERE id = 配置ID;
 
 -- 查询特定配置类型的配置值
 SELECT config_value->>'ts_codes' as ts_codes
 FROM public.user_config
 WHERE config_type = 'dashboard_index_overview'
 AND is_default = TRUE
 AND is_active = TRUE
 LIMIT 1;
 
 -- 查询JSONB数组中的元素
 SELECT jsonb_array_elements_text(config_value->'ts_codes') as ts_code
 FROM public.user_config
 WHERE config_type = 'dashboard_index_overview'
 AND is_default = TRUE
 AND is_active = TRUE
 LIMIT 1;
 */
-- ============================================
-- 7. 数据字典说明
-- ============================================
/*
 配置类型 (config_type) 说明：
 
 | 配置类型 | 说明 | config_value 结构示例 |
 |---------|------|---------------------|
 | dashboard_index_overview | 看板指数概览配置 | {"ts_codes": [...], "sort_order": {...}, "display_options": {...}} |
 | index_daily_query | 指数日线查询默认配置 | {"default_ts_codes": [...], "default_date_range": {...}, "default_limit": 1000} |
 | index_weekly_query | 指数周线查询默认配置 | {"default_ts_codes": [...], "default_date_range": {...}, "default_limit": 1000} |
 | index_dailybasic_query | 大盘指数每日指标查询配置 | {"default_ts_codes": [...], "default_date_range": {...}} |
 | index_global_query | 国际指数查询配置 | {"default_ts_codes": [...], "default_date_range": {...}} |
 | index_factor_query | 指数技术因子查询配置 | {"default_ts_codes": [...], "default_date_range": {...}, "default_trade_date": "YYYY-MM-DD"} |
 | sw_daily_query | 申万行业日线查询配置 | {"default_ts_codes": [...], "default_date_range": {...}} |
 | index_sync_settings | 指数同步设置配置 | {"auto_sync": false, "sync_interval": 3600, "default_date_range": {...}, "batch_size": 10} |
 | index_display_settings | 指数显示设置配置 | {"columns": [...], "page_size": 20, "sort_field": "trade_date", "sort_order": "desc"} |
 | index_alert_settings | 指数预警设置配置 | {"alerts": [...], "notification_enabled": true} |
 
 配置键 (config_key) 说明：
 - 'default': 默认配置
 - 'custom_1', 'custom_2', ...: 自定义配置
 - 'query_preset_1', 'query_preset_2', ...: 查询预设
 - 'sync_preset_1', 'sync_preset_2', ...: 同步预设
 
 用户ID (user_id) 说明：
 - NULL: 全局默认配置（所有用户共享）
 - UUID: 用户特定配置（仅该用户可见和使用）
 
 配置值 (config_value) 说明：
 - 使用 JSONB 格式存储，支持灵活的嵌套结构
 - 可以使用 PostgreSQL 的 JSONB 操作符进行查询和更新
 - 支持索引（GIN索引）以提高查询性能
 */