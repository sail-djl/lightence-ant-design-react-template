#!/usr/bin/env node

/**
 * 测试脚本：验证 tsconfig.json 的 paths 配置在启动后是否保存
 */

const fs = require('fs');
const path = require('path');

const tsconfigPath = path.join(__dirname, 'tsconfig.json');

// 等待一秒后检查
setTimeout(() => {
  const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'));
  
  if (tsconfig.compilerOptions.paths && tsconfig.compilerOptions.paths['@app/*']) {
    console.log('\n✅ 成功！tsconfig.json 的 paths 配置已保存');
    console.log('路径别名配置:', JSON.stringify(tsconfig.compilerOptions.paths, null, 2));
    process.exit(0);
  } else {
    console.log('\n❌ 失败！tsconfig.json 的 paths 配置丢失');
    console.log('当前 compilerOptions:', JSON.stringify(tsconfig.compilerOptions, null, 2));
    process.exit(1);
  }
}, 1000);





