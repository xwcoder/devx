# GitHub Actions 中的 Provision Profile 配置指南

本指南详细说明如何在 GitHub Actions CI/CD 流程中正确配置和使用 macOS provision profile。

## 概述

Provision Profile 是 macOS 应用签名的重要组成部分，它包含了应用的权限配置和开发者团队信息。在 GitHub Actions 中，我们需要正确处理 provision profile 文件以确保应用能够正确签名。

## 配置步骤

### 1. 准备 Provision Profile

#### 方法一：使用现有的 Provision Profile

1. 从 Apple Developer Portal 下载你的 provision profile 文件
2. 将文件转换为 base64 格式：

```bash
base64 -i your_profile.mobileprovision
```

3. 将 base64 字符串添加到 GitHub Secrets：
   - 名称：`MACOS_PROVISION_PROFILE_BASE64`
   - 值：base64 编码的 provision profile 内容

#### 方法二：使用自动生成的 Provision Profile

如果不想手动管理 provision profile，系统会自动生成一个基本的配置。

### 2. GitHub Secrets 配置

确保以下 secrets 已正确配置：

```yaml
# 必需的 secrets
APPLE_TEAM_ID: "你的开发者团队ID"
MACOS_P12_BASE64: "你的开发者证书的base64编码"
MACOS_P12_PASSWORD: "证书密码"
APPLE_ID: "你的Apple ID"
APPLE_ID_PASS: "Apple ID密码"

# 可选的 provision profile
MACOS_PROVISION_PROFILE_BASE64: "provision profile的base64编码（可选）"
```

### 3. 工作流配置

GitHub Actions 工作流会自动处理 provision profile：

```yaml
- name: Setup Provision Profile (macOS only)
  if: matrix.os == 'macos-latest'
  run: |
    if [ -n "${{ secrets.MACOS_PROVISION_PROFILE_BASE64 }}" ]; then
      echo "设置 provision profile..."
      echo "${{ secrets.MACOS_PROVISION_PROFILE_BASE64 }}" | base64 -d > src-tauri/embedded.provisionprofile
      echo "✅ Provision profile 设置成功"
    else
      echo "⚠️ 未找到 provision profile，使用默认配置"
      chmod +x scripts/setup-provision-profile.sh
      ./scripts/setup-provision-profile.sh "${{ secrets.APPLE_TEAM_ID }}"
    fi
```

### 4. 自动生成脚本

项目包含一个自动生成 provision profile 的脚本：

```bash
# 使用方法
./scripts/setup-provision-profile.sh <TEAM_ID> [BUNDLE_ID]

# 示例
./scripts/setup-provision-profile.sh ABC123DEF com.creep.devx.app
```

## 验证和调试

### 1. 验证 Provision Profile

工作流中包含验证步骤：

```yaml
- name: Verify signing (macOS only)
  if: matrix.os == 'macos-latest'
  run: |
    echo "验证应用签名..."
    codesign -dv --verbose=4 "src-tauri/target/${{ matrix.target }}/release/bundle/app/DevX.app"
```

### 2. 手动验证

在本地环境中验证 provision profile：

```bash
# 检查 provision profile 信息
security cms -D -i src-tauri/embedded.provisionprofile

# 验证应用签名
codesign -dv --verbose=4 path/to/your/app.app

# 检查 entitlements
codesign -d --entitlements :- path/to/your/app.app
```

## 常见问题

### 1. Provision Profile 过期

如果 provision profile 过期，需要：
- 在 Apple Developer Portal 更新 provision profile
- 重新下载并更新 GitHub Secrets

### 2. 权限不足

确保 provision profile 包含应用所需的所有权限：

```xml
<key>Entitlements</key>
<dict>
    <key>application-identifier</key>
    <string>$(AppIdentifierPrefix)com.creep.devx.app</string>
    <key>com.apple.developer.team-identifier</key>
    <string>YOUR_TEAM_ID</string>
    <key>com.apple.security.network.client</key>
    <true/>
    <key>com.apple.security.files.user-selected.read-write</key>
    <true/>
    <!-- 其他所需权限 -->
</dict>
```

### 3. Bundle ID 不匹配

确保 provision profile 中的 Bundle ID 与 `tauri.conf.json` 中的配置一致：

```json
{
  "tauri": {
    "bundle": {
      "identifier": "com.creep.devx.app"
    }
  }
}
```

## 最佳实践

### 1. 使用 App Store Distribution Profile

对于 App Store 发布，使用专门的 App Store Distribution provision profile。

### 2. 定期更新

- 定期检查 provision profile 的过期时间
- 在过期前更新 GitHub Secrets

### 3. 测试验证

在发布前，确保在本地环境中测试签名和公证流程。

### 4. 安全存储

- 不要在代码中硬编码 provision profile
- 使用 GitHub Secrets 安全存储敏感信息

## 故障排除

### 1. 构建失败

检查日志中的错误信息：
- Provision profile 格式是否正确
- Bundle ID 是否匹配
- 权限是否足够

### 2. 签名失败

- 验证开发者证书是否有效
- 检查 Team ID 是否正确
- 确认 provision profile 与证书匹配

### 3. 公证失败

- 确保应用已正确签名
- 检查网络连接
- 验证 Apple ID 凭据

## 相关文件

- `scripts/setup-provision-profile.sh` - 自动生成 provision profile 的脚本
- `src-tauri/embedded.provisionprofile` - provision profile 文件模板
- `.github/workflows/release.yml` - GitHub Actions 工作流配置
- `docs/provision-profile-guide.md` - 详细的 provision profile 配置指南 