# 发布指南

本指南详细说明如何发布 DevX 应用的新版本。

## 发布流程

### 1. 准备发布

确保所有更改已提交到主分支：

```bash
git status
git add .
git commit -m "feat: 新功能描述"
git push origin main
```

### 2. 运行发布脚本

使用发布脚本自动更新版本并创建标签：

```bash
# 发布补丁版本 (0.1.0 -> 0.1.1)
./scripts/release.sh 0.1.1

# 发布次要版本 (0.1.0 -> 0.2.0)
./scripts/release.sh 0.2.0

# 发布主要版本 (0.1.0 -> 1.0.0)
./scripts/release.sh 1.0.0
```

### 3. 发布脚本功能

发布脚本会自动执行以下操作：

- ✅ 更新 `package.json` 版本
- ✅ 更新 `src-tauri/Cargo.toml` 版本
- ✅ 更新 `src-tauri/tauri.conf.json` 版本
- ✅ 更新 `src-tauri/tauri.appstore.conf.json` 版本
- ✅ 提交版本更新到 Git
- ✅ 创建版本标签
- ✅ 推送更改和标签到远程仓库

### 4. 自动构建和发布

推送标签后，GitHub Actions 会自动：

1. **多平台构建**
   - Windows (x64) - MSI 安装包
   - macOS (Intel + Apple Silicon) - DMG 安装包
   - Linux (x64) - AppImage

2. **macOS 特殊处理**
   - 代码签名
   - 自动公证
   - Provision Profile 处理

3. **创建 GitHub Release**
   - 自动生成发布说明
   - 上传所有平台的安装包
   - 标记为正式发布

## 版本管理

### 语义化版本

遵循 [语义化版本](https://semver.org/lang/zh-CN/) 规范：

- **主版本号**：不兼容的 API 修改
- **次版本号**：向下兼容的功能性新增
- **修订号**：向下兼容的问题修正

### 版本文件

以下文件会被自动更新：

| 文件 | 描述 |
|------|------|
| `package.json` | Node.js 项目版本 |
| `src-tauri/Cargo.toml` | Rust 项目版本 |
| `src-tauri/tauri.conf.json` | Tauri 应用配置版本 |
| `src-tauri/tauri.appstore.conf.json` | App Store 配置版本 |

## 测试发布流程

在正式发布前，可以测试版本更新功能：

```bash
# 运行版本更新测试
./scripts/test-version-update.sh
```

测试脚本会验证所有版本文件是否正确更新。

## 手动发布（可选）

如果需要手动发布，可以：

1. 手动更新所有版本文件
2. 创建 Git 标签
3. 推送标签触发 GitHub Actions

```bash
# 手动创建标签
git tag v1.0.0
git push origin v1.0.0
```

## 故障排除

### 常见问题

1. **版本不一致**
   - 运行 `./scripts/test-version-update.sh` 检查
   - 确保所有版本文件格式正确

2. **构建失败**
   - 检查 GitHub Actions 日志
   - 验证所有必需的 secrets 已配置

3. **签名失败**
   - 确认 macOS 证书和 provision profile 有效
   - 检查 Team ID 和 Bundle ID 配置

### 回滚发布

如果需要回滚：

```bash
# 删除标签
git tag -d v1.0.0
git push origin :refs/tags/v1.0.0

# 回滚代码
git reset --hard HEAD~1
git push origin main --force
```

## 发布检查清单

发布前请确认：

- [ ] 所有功能已测试
- [ ] 文档已更新
- [ ] 版本号符合语义化版本规范
- [ ] 所有依赖项版本兼容
- [ ] 构建脚本正常工作
- [ ] GitHub Secrets 已配置
- [ ] 发布说明已准备

## 相关文档

- [GitHub Actions 配置](../.github/workflows/)
- [App Store 发布指南](APPSTORE_SETUP.md)
- [Provision Profile 配置](docs/provision-profile-guide.md)
- [GitHub Actions Provision Profile 指南](docs/github-actions-provision-profile.md) 