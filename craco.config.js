const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const WebpackBar = require('webpackbar');
const CracoAlias = require('craco-alias');
const fs = require('fs');
const path = require('path');

process.env.BROWSER = 'none';

const enableAnalyzer = process.env.ANALYZE === 'true';

// 自定义 Craco 插件：在 webpack 启动前确保 tsconfig.json 有 paths 配置
const TsConfigPathsPlugin = {
  overrideWebpackConfig: ({ webpackConfig }) => {
    const tsconfigPath = path.join(__dirname, 'tsconfig.json');
    const tsconfigPathsPath = path.join(__dirname, 'tsconfig.paths.json');

    try {
      const tsconfigPaths = JSON.parse(fs.readFileSync(tsconfigPathsPath, 'utf-8'));
      const pathsConfig = tsconfigPaths.compilerOptions.paths;
      
      const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'));
      
      if (!tsconfig.compilerOptions.paths || 
          JSON.stringify(tsconfig.compilerOptions.paths) !== JSON.stringify(pathsConfig)) {
        tsconfig.compilerOptions.paths = pathsConfig;
        fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2) + '\n');
        console.log('✅ tsconfig.json paths 已在 webpack 编译前修复');
      }
    } catch (err) {
      console.error('❌ 修复 tsconfig.json 失败:', err.message);
    }

    return webpackConfig;
  },
};

module.exports = {
  webpack: {
    plugins: [
      new WebpackBar({ profile: true }),
      ...(enableAnalyzer ? [new BundleAnalyzerPlugin({ analyzerMode: 'server', openAnalyzer: true, analyzerPort: 8889 })] : []),
    ],
  },
  plugins: [
    {
      plugin: TsConfigPathsPlugin,
    },
    {
      plugin: CracoAlias,
      options: {
        source: 'tsconfig',
        baseUrl: './src/',
        tsConfigPath: './tsconfig.paths.json',
      },
    },
  ],
};
