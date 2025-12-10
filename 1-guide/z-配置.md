yarn start
  ↓
craco start
  ↓
react-scripts start (内部调用)
  ↓
读取环境变量文件 (.env.development, .env.local, .env)
  ↓
应用 craco.config.js 的配置覆盖
  ↓
启动开发服务器
