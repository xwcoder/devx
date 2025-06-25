# macOS 签名和 App Store 发布配置指南

本指南将帮助你配置 macOS 代码签名和 App Store 发布流程。

## 前提条件

### 1. Apple 开发者账号
- 需要付费的 Apple Developer Program 会员资格（$99/年）
- 访问 [Apple Developer](https://developer.apple.com) 注册

### 2. 证书和配置文件
- 开发者证书（Developer Certificate）
- 分发证书（Distribution Certificate）
- App Store 分发证书（App Store Distribution Certificate）
- 应用 ID（App ID）
- 配置文件（Provisioning Profile）

## 步骤 1: 创建 Apple Developer 证书

### 1.1 登录 Apple Developer
1. 访问 [Apple Developer](https://developer.apple.com)
2. 使用你的 Apple ID 登录
3. 进入 "Certificates, Identifiers & Profiles"

### 1.2 创建 App ID
1. 点击 "Identifiers" → "+"
2. 选择 "App IDs" → "App"
3. 填写应用信息：
   - **Description**: DevX
   - **Bundle ID**: com.creep.devx.app
   - **Capabilities**: 根据需要选择
4. 点击 "Continue" → "Register"

### 1.3 创建证书
1. 点击 "Certificates" → "+"
2. 选择 "Mac App Distribution"
3. 按照向导创建证书
4. 下载并安装证书到 Keychain

### 1.4 创建 Provision Profile
1. 点击 "Profiles" → "+"
2. 选择 "Mac App Distribution"
3. 选择你的 App ID（com.creep.devx.app）
4. 选择你的分发证书
5. 填写 Provision Profile 名称（如：DevX Mac App Distribution）
6. 点击 "Continue" → "Generate"
7. 下载 provision profile 文件并重命名为 `embedded.provisionprofile`

### 1.5 创建 App Store Connect API 密钥
1. 进入 "Keys" → "+"
2. 选择 "App Store Connect API"
3. 填写密钥名称和权限
4. 下载 API 密钥文件（.p8）

## 步骤 2: 配置 GitHub Secrets

在 GitHub 仓库设置中添加以下 Secrets：

### 必需的 Secrets
```bash
# macOS 签名证书
MACOS_P12_BASE64=<base64编码的p12证书>
MACOS_P12_PASSWORD=<p12证书密码>

# Apple ID 信息
APPLE_ID=<你的Apple ID邮箱>
APPLE_ID_PASS=<App专用密码>
APPLE_TEAM_ID=<你的Team ID>

# App Store Connect API
APPSTORE_API_KEY_ID=<API密钥ID>
APPSTORE_ISSUER_ID=<Issuer ID>
APPSTORE_PRIVATE_KEY=<API私钥内容>
```

### 如何获取这些值

#### 1. 导出 p12 证书
```bash
# 在 macOS 上运行
security export -k login.keychain -t identities -f pkcs12 -o certificate.p12
base64 -i certificate.p12 | pbcopy
```

#### 2. 获取 Team ID
1. 登录 [Apple Developer](https://developer.apple.com)
2. 在右上角点击你的账户
3. 查看 "Membership" 部分
4. Team ID 格式类似：`ABC123DEF4`

#### 3. 获取 App Store Connect API 信息
1. 在 "Keys" 页面查看已创建的 API 密钥
2. 记录 Key ID 和 Issuer ID
3. 下载 .p8 文件并读取内容

#### 4. 创建 App 专用密码
1. 访问 [Apple ID](https://appleid.apple.com)
2. 进入 "安全性" → "App 专用密码"
3. 生成新的专用密码

## 步骤 3: 更新配置文件

### 3.1 自动设置（推荐）
使用提供的脚本自动设置所有配置文件：

```bash
# 替换 TEAM_ID 为你的实际 Team ID
./scripts/setup-entitlements.sh ABC123DEF4
```

### 3.2 手动更新配置文件

#### 更新 tauri.conf.json
将以下占位符替换为实际值：
```json
{
  "macOS": {
    "category": "public.app-category.developer-tools",
    "embedded.provisionprofile": "embedded.provisionprofile",
    "signingIdentity": "Apple Distribution: Your Name (TEAM_ID)",
    "notarization": {
      "teamId": "TEAM_ID"
    }
  }
}
```

#### 更新 tauri.appstore.conf.json
同样替换占位符：
```json
{
  "macOS": {
    "category": "public.app-category.developer-tools",
    "embedded.provisionprofile": "embedded.provisionprofile",
    "signingIdentity": "Apple Distribution: Your Name (TEAM_ID)"
  }
}
```

#### 更新 entitlements 文件
在 `src-tauri/entitlements.plist` 和 `src-tauri/entitlements.appstore.plist` 中：

```xml
<key>com.apple.application-identifier</key>
<string>$(AppIdentifierPrefix)com.creep.devx.app</string>
<key>com.apple.developer.team-identifier</key>
<string>TEAM_ID</string>
```

#### 配置 Provision Profile
1. 将下载的 provision profile 文件重命名为 `embedded.provisionprofile`
2. 放置到 `src-tauri/` 目录下
3. 确保文件中的 Team ID 和 Bundle ID 正确

### 3.3 重要配置项说明

#### embedded.provisionprofile
- **作用**: 包含应用的安全配置和权限信息
- **文件**: 从 Apple Developer 下载的 provision profile
- **位置**: `src-tauri/embedded.provisionprofile`
- **说明**: 包含证书、权限和团队信息

#### com.apple.application-identifier
- **作用**: 唯一标识应用，用于代码签名和沙盒
- **格式**: `$(AppIdentifierPrefix)com.creep.devx.app`
- **说明**: `$(AppIdentifierPrefix)` 会自动替换为你的 Team ID

#### com.apple.developer.team-identifier
- **作用**: 标识开发者团队，用于证书验证
- **格式**: 10 位字母数字组合，如 `ABC123DEF4`
- **获取**: 在 Apple Developer 账户的 Membership 部分查看

#### 应用分类
- **category**: 定义了应用在 macOS 中的分类
- **public.app-category.developer-tools**: 开发者工具分类，适合 DevX 应用
- 其他可选分类请参考 [macOS 应用分类指南](./docs/macos-categories.md)

## 步骤 4: 测试签名

### 4.1 本地测试
```bash
# 构建并签名应用
pnpm tauri build --target x86_64-apple-darwin

# 验证签名
codesign -dv --verbose=4 src-tauri/target/x86_64-apple-darwin/release/bundle/app/DevX.app

# 验证 entitlements
codesign -d --entitlements :- src-tauri/target/x86_64-apple-darwin/release/bundle/app/DevX.app

# 验证 provision profile
security cms -D -i src-tauri/embedded.provisionprofile
```

### 4.2 测试公证
```bash
# 公证应用
xcrun notarytool submit \
  --apple-id "your-apple-id@example.com" \
  --password "app-specific-password" \
  --team-id "TEAM_ID" \
  "src-tauri/target/x86_64-apple-darwin/release/bundle/app/DevX.app" \
  --wait

# 附加公证信息
xcrun stapler staple "src-tauri/target/x86_64-apple-darwin/release/bundle/app/DevX.app"
```

## 步骤 5: 发布流程

### 5.1 发布到 GitHub（带签名）
```bash
# 使用普通发布脚本
./scripts/release.sh 1.0.0
```

### 5.2 发布到 App Store
```bash
# 使用 App Store 发布脚本
./scripts/appstore-release.sh 1.0.0
```

## 步骤 6: App Store Connect 配置

### 6.1 创建应用
1. 登录 [App Store Connect](https://appstoreconnect.apple.com)
2. 点击 "我的 App" → "+"
3. 选择 "新建 App"
4. 填写应用信息：
   - **平台**: macOS
   - **名称**: DevX
   - **主要语言**: 中文（简体）
   - **Bundle ID**: com.creep.devx.app
   - **SKU**: devx-macos
   - **分类**: 开发者工具

### 6.2 配置应用信息
1. **App 信息**: 填写应用描述、关键词等
2. **价格与销售范围**: 设置价格和销售地区
3. **App 审核信息**: 填写审核所需信息
4. **App 隐私**: 配置隐私政策

### 6.3 上传构建版本
1. 在 "活动" 页面查看上传的构建版本
2. 选择要发布的构建版本
3. 填写版本信息、截图等
4. 提交审核

## 常见问题

### Q: 签名失败
A: 检查证书是否正确安装，Team ID 是否正确

### Q: 公证失败
A: 确保使用 App 专用密码，而不是 Apple ID 密码

### Q: App Store 上传失败
A: 检查 Bundle ID 是否与 App Store Connect 中的应用匹配

### Q: 审核被拒
A: 查看拒绝原因，常见问题包括：
- 应用功能描述不准确
- 缺少隐私政策
- 应用崩溃或功能异常
- 分类选择不当

### Q: 应用分类不正确
A: 确保在配置文件和 App Store Connect 中使用相同的分类

### Q: entitlements 配置错误
A: 检查以下配置项：
- `com.apple.application-identifier` 格式是否正确
- `com.apple.developer.team-identifier` 是否为有效的 Team ID
- 确保所有配置文件中的 Team ID 一致

### Q: provision profile 错误
A: 检查以下配置项：
- provision profile 文件是否存在且有效
- provision profile 中的 Bundle ID 是否与应用一致
- provision profile 是否包含正确的证书和权限

### Q: 沙盒权限不足
A: 根据需要添加相应的权限：
- 网络访问：`com.apple.security.network.client`
- 文件访问：`com.apple.security.files.user-selected.read-write`
- 自动化：`com.apple.security.automation.apple-events`

## 参考资源

- [Apple Developer Documentation](https://developer.apple.com/documentation/)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Tauri macOS Deployment](https://tauri.app/v2/guides/deployment/macos/)
- [Code Signing Guide](https://developer.apple.com/support/code-signing/)
- [macOS 应用分类指南](./docs/macos-categories.md)
- [Entitlements Reference](https://developer.apple.com/library/archive/documentation/Miscellaneous/Reference/EntitlementKeyReference/Chapters/AboutEntitlements.html)
- [Provision Profile 配置指南](./docs/provision-profile-guide.md) 