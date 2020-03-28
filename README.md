# tnpm-sync

[![NPM version](https://img.shields.io/npm/v/tnpm-sync.svg?style=flat)](https://npmjs.org/package/tnpm-sync) [![NPM downloads](http://img.shields.io/npm/dm/tnpm-sync.svg?style=flat)](https://npmjs.org/package/tnpm-sync) [![Install size](https://badgen.net/packagephobia/install/tnpm-sync)](https://packagephobia.now.sh/result?p=tnpm-sync)

> 同步 npm 官方源到 tnpm 私有源，解决包发布后，私有源同步不及时的问题。

## 特性

- [x] 支持 lerna 和独立包形式。
- [x] 支持使用 cli 与函数调用。
- [x] 并行同步 npm 包
- [x] 自定义同步命令，默认用阿里内部的 `tnpm sync`

## 用法

使用 cli 方式：

```bash
# 直接使用
$ npx --ignore-existing -p tnpm-sync@latest tnpm-sync .

# 全局安装
$ npm i tnpm-sync -g
$ tnpm-sync .
```

同时可使用以下同步参数：

```bash
# 同步 package-foo 和 package-bar 包
$ tnpm-sync --packages=package-foo,package-bar

# 同步某个目录下的包
$ tnpm-sync ./packages/package-foo

# 自定义同步命令
$ tnpm-sync --command="cnpm sync" .
```

函数调用：

```js
const tnpmSync, { getPackages } = require('tnpm-sync');

tnpmSync({
  cwd: process.cwd(),
  packages: ['tnpm-sync', 'package-bar', 'package-foo'],
  command: 'tnpm sync',
});

// getPackages(process.cwd());
// => 获取当前目录下，可同步的包
```
