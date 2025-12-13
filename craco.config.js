const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const WebpackBar = require('webpackbar');
const CracoAlias = require('craco-alias');

process.env.BROWSER = 'none';

const enableAnalyzer = process.env.ANALYZE === 'true';

module.exports = {
  webpack: {
    plugins: [
      new WebpackBar({ profile: true }),
      ...(enableAnalyzer ? [new BundleAnalyzerPlugin({ analyzerMode: 'server', openAnalyzer: true, analyzerPort: 8889 })] : []),
    ],
  },
  plugins: [
    {
      plugin: CracoAlias,
      options: {
        source: 'tsconfig',
        // baseUrl SHOULD be specified
        // plugin does not take it from tsconfig
        baseUrl: './src/',
        /* tsConfigPath should point to the file where "baseUrl" and "paths"
         are specified*/
        tsConfigPath: './tsconfig.paths.json',
      },
    },
  ],
};
