module.exports = {
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  parserOptions: {
    ecmaVersion: 2021, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
    ecmaFeatures: {
      jsx: true, // Allows for the parsing of JSX
    },
  },
  settings: {
    react: {
      version: 'detect', // Tells eslint-plugin-react to automatically detect the version of React to use
    },
  },
  plugins: ['react', 'react-hooks'],
  extends: [
    'plugin:react/recommended', // Uses the recommended rules from @eslint-plugin-react
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from @typescript-eslint/eslint-plugin
    'prettier', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    // 移除 'plugin:prettier/recommended' 以完全禁用 Prettier 检查
  ],
  rules: {
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    'react/prop-types': 'off',
    'react/display-name': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'off', // 忽略依赖项警告
    // TypeScript 相关 - 忽略不影响使用的警告
    '@typescript-eslint/no-unused-vars': 'off', // 忽略未使用的变量
    '@typescript-eslint/no-explicit-any': 'off', // 允许使用 any 类型
    '@typescript-eslint/explicit-module-boundary-types': 'off', // 不强制显式返回类型
    '@typescript-eslint/explicit-function-return-type': 'off', // 不强制函数返回类型
    '@typescript-eslint/no-empty-function': 'off', // 允许空函数
    '@typescript-eslint/no-empty-interface': 'off', // 允许空接口
    '@typescript-eslint/ban-ts-comment': 'off', // 允许 @ts-ignore 等注释
    '@typescript-eslint/no-non-null-assertion': 'off', // 允许非空断言 !
    '@typescript-eslint/ban-types': 'off', // 允许使用某些被禁止的类型
    '@typescript-eslint/no-inferrable-types': 'off', // 允许可推断的类型注解
    // 其他常见的不影响使用的规则
    'no-console': 'off', // 允许使用 console
    'no-debugger': 'warn', // debugger 只警告，不阻止
    'no-unused-expressions': 'off', // 允许未使用的表达式
    'no-empty': 'off', // 允许空代码块
    'no-useless-escape': 'off', // 允许不必要的转义
    'prefer-const': 'warn', // 只警告，不强制
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
  },
};
