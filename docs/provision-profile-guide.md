# Provision Profile 配置指南

Provision Profile 是 macOS 应用签名的重要组成部分，它包含了应用的安全配置和权限信息。

## 什么是 Provision Profile

Provision Profile 是一个包含以下信息的配置文件：
- 应用标识符（App ID）
- 开发者证书信息
- 权限配置（Entitlements）
- 团队标识符
- 有效期信息

## 创建 Provision Profile

### 1. 登录 Apple Developer
1. 访问 [Apple Developer](https://developer.apple.com)
2. 使用你的 Apple ID 登录
3. 进入 "Certificates, Identifiers & Profiles"

### 2. 创建 App ID（如果还没有）
1. 点击 "Identifiers" → "+"
2. 选择 "App IDs" → "App"
3. 填写应用信息：
   - **Description**: DevX
   - **Bundle ID**: com.creep.devx.app
   - **Capabilities**: 根据需要选择
4. 点击 "Continue" → "Register"

### 3. 创建 Provision Profile
1. 点击 "Profiles" → "+"
2. 选择 "Mac App Distribution"
3. 选择你的 App ID（com.creep.devx.app）
4. 选择你的分发证书
5. 填写 Provision Profile 名称（如：DevX Mac App Distribution）
6. 点击 "Continue" → "Generate"

### 4. 下载 Provision Profile
1. 在 Profiles 列表中找到刚创建的 Provision Profile
2. 点击下载按钮
3. 将下载的文件重命名为 `embedded.provisionprofile`
4. 放置到 `src-tauri/` 目录下

## Provision Profile 配置

### 1. Tauri 配置
在 `src-tauri/tauri.conf.json` 中：
```json
{
  "macOS": {
    "embedded.provisionprofile": "embedded.provisionprofile"
  }
}
```

在 `src-tauri/tauri.appstore.conf.json` 中：
```json
{
  "macOS": {
    "embedded.provisionprofile": "embedded.provisionprofile"
  }
}
```

### 2. 文件结构
```
src-tauri/
├── tauri.conf.json
├── tauri.appstore.conf.json
├── entitlements.plist
├── entitlements.appstore.plist
└── embedded.provisionprofile  # 从 Apple Developer 下载
```

## Provision Profile 内容示例

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>AppIDName</key>
	<string>DevX</string>
	<key>ApplicationIdentifierPrefix</key>
	<array>
		<string>ABC123DEF4</string>
	</array>
	<key>CreationDate</key>
	<date>2024-01-01T00:00:00Z</date>
	<key>DeveloperCertificates</key>
	<array>
		<data>
			<!-- 实际的证书数据 -->
		</data>
	</array>
	<key>Entitlements</key>
	<dict>
		<key>application-identifier</key>
		<string>$(AppIdentifierPrefix)com.creep.devx.app</string>
		<key>com.apple.developer.team-identifier</key>
		<string>ABC123DEF4</string>
		<key>com.apple.security.app-sandbox</key>
		<true/>
		<key>com.apple.security.network.client</key>
		<true/>
		<key>com.apple.security.files.user-selected.read-write</key>
		<true/>
		<key>com.apple.security.files.downloads.read-write</key>
		<true/>
		<key>com.apple.security.files.desktop.read-write</key>
		<true/>
		<key>com.apple.security.files.documents.read-write</key>
		<true/>
		<key>com.apple.security.automation.apple-events</key>
		<true/>
	</dict>
	<key>ExpirationDate</key>
	<date>2025-01-01T00:00:00Z</date>
	<key>Name</key>
	<string>DevX Mac App Distribution</string>
	<key>Platform</key>
	<array>
		<string>macOS</string>
	</array>
	<key>TeamIdentifier</key>
	<array>
		<string>ABC123DEF4</string>
	</array>
	<key>TeamName</key>
	<string>Your Team Name</string>
	<key>TimeToLive</key>
	<integer>365</integer>
	<key>UUID</key>
	<string>00000000-0000-0000-0000-000000000000</string>
	<key>Version</key>
	<integer>1</integer>
</dict>
</plist>
```

## 自动化设置

### 使用设置脚本
```bash
# 设置 Team ID（会更新 provision profile 中的占位符）
./scripts/setup-entitlements.sh ABC123DEF4
```

### 手动替换
1. 下载 provision profile 文件
2. 重命名为 `embedded.provisionprofile`
3. 放置到 `src-tauri/` 目录
4. 确保文件中的 Team ID 和 Bundle ID 正确

## 验证配置

### 1. 验证 Provision Profile
```bash
# 查看 provision profile 信息
security cms -D -i src-tauri/embedded.provisionprofile

# 验证 provision profile 格式
plutil -lint src-tauri/embedded.provisionprofile
```

### 2. 验证应用签名
```bash
# 构建应用
pnpm tauri build --target x86_64-apple-darwin

# 查看签名信息
codesign -dv --verbose=4 src-tauri/target/x86_64-apple-darwin/release/bundle/app/DevX.app

# 验证 provision profile 是否正确嵌入
codesign -d --entitlements :- src-tauri/target/x86_64-apple-darwin/release/bundle/app/DevX.app
```

## 常见问题

### Q: Provision Profile 过期
A: Provision Profile 通常有效期为一年，需要定期更新

### Q: Bundle ID 不匹配
A: 确保 provision profile 中的 Bundle ID 与应用配置一致

### Q: 证书不匹配
A: 确保 provision profile 中包含了正确的开发者证书

### Q: 权限配置错误
A: 检查 provision profile 中的 Entitlements 配置

### Q: Team ID 错误
A: 确保 provision profile 中的 Team ID 正确

## 最佳实践

1. **定期更新**: Provision Profile 需要定期更新
2. **版本控制**: 不要将实际的 provision profile 提交到版本控制
3. **备份**: 保留 provision profile 的备份
4. **测试**: 在多个 macOS 版本上测试签名
5. **文档化**: 记录 provision profile 的创建和配置过程

## 安全注意事项

1. **保密性**: Provision Profile 包含敏感信息，不要公开分享
2. **访问控制**: 限制对 provision profile 文件的访问
3. **过期管理**: 及时更新过期的 provision profile
4. **证书管理**: 妥善管理相关的开发者证书

## 参考资源

- [Apple Developer Documentation](https://developer.apple.com/documentation/)
- [Code Signing Guide](https://developer.apple.com/support/code-signing/)
- [Provisioning Profiles](https://developer.apple.com/library/archive/documentation/IDEs/Conceptual/AppDistributionGuide/MaintainingProfiles/MaintainingProfiles.html)
- [Tauri macOS Deployment](https://tauri.app/v2/guides/deployment/macos/) 