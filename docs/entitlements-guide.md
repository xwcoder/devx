# macOS Entitlements 配置指南

Entitlements 是 macOS 应用的重要配置文件，定义了应用的安全权限和功能访问。

## 什么是 Entitlements

Entitlements 是 macOS 应用沙盒和安全机制的核心，它：
- 定义应用可以访问的系统资源
- 控制应用的网络、文件、硬件访问权限
- 启用特定的系统功能（如 JIT 编译、自动化等）
- 确保应用在沙盒环境中安全运行

## 配置项详解

### 1. 应用标识符

#### com.apple.application-identifier
```xml
<key>com.apple.application-identifier</key>
<string>$(AppIdentifierPrefix)com.creep.devx.app</string>
```
- **作用**: 唯一标识应用
- **格式**: `$(AppIdentifierPrefix) + Bundle ID`
- **说明**: `$(AppIdentifierPrefix)` 会自动替换为你的 Team ID

#### com.apple.developer.team-identifier
```xml
<key>com.apple.developer.team-identifier</key>
<string>TEAM_ID</string>
```
- **作用**: 标识开发者团队
- **格式**: 10 位字母数字组合
- **示例**: `ABC123DEF4`

### 2. 安全权限

#### 代码签名权限
```xml
<key>com.apple.security.cs.allow-jit</key>
<true/>
<key>com.apple.security.cs.allow-unsigned-executable-memory</key>
<true/>
<key>com.apple.security.cs.allow-dyld-environment-variables</key>
<true/>
```
- **allow-jit**: 允许即时编译（JIT）
- **allow-unsigned-executable-memory**: 允许执行未签名代码
- **allow-dyld-environment-variables**: 允许动态链接器环境变量

#### 网络权限
```xml
<key>com.apple.security.network.client</key>
<true/>
<key>com.apple.security.network.server</key>
<true/>
```
- **network.client**: 允许发起网络连接
- **network.server**: 允许接受网络连接

#### 文件访问权限
```xml
<key>com.apple.security.files.user-selected.read-write</key>
<true/>
<key>com.apple.security.files.downloads.read-write</key>
<true/>
<key>com.apple.security.files.desktop.read-write</key>
<true/>
<key>com.apple.security.files.documents.read-write</key>
<true/>
```
- **user-selected**: 用户选择的文件
- **downloads**: 下载文件夹
- **desktop**: 桌面文件夹
- **documents**: 文档文件夹

#### 自动化权限
```xml
<key>com.apple.security.automation.apple-events</key>
<true/>
```
- **apple-events**: 允许发送 Apple Events

### 3. App Store 沙盒

#### 应用沙盒
```xml
<key>com.apple.security.app-sandbox</key>
<true/>
```
- **作用**: 启用应用沙盒
- **说明**: App Store 应用必须启用此选项

## DevX 应用的 Entitlements 配置

### 普通发布版本 (entitlements.plist)
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>com.apple.application-identifier</key>
    <string>$(AppIdentifierPrefix)com.creep.devx.app</string>
    <key>com.apple.developer.team-identifier</key>
    <string>TEAM_ID</string>
    <key>com.apple.security.cs.allow-jit</key>
    <true/>
    <key>com.apple.security.cs.allow-unsigned-executable-memory</key>
    <true/>
    <key>com.apple.security.cs.allow-dyld-environment-variables</key>
    <true/>
    <key>com.apple.security.network.client</key>
    <true/>
    <key>com.apple.security.network.server</key>
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
</plist>
```

### App Store 版本 (entitlements.appstore.plist)
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>com.apple.application-identifier</key>
    <string>$(AppIdentifierPrefix)com.creep.devx.app</string>
    <key>com.apple.developer.team-identifier</key>
    <string>TEAM_ID</string>
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
</plist>
```

## 权限选择指南

### 必需的权限
- **com.apple.application-identifier**: 所有签名应用都需要
- **com.apple.developer.team-identifier**: 所有签名应用都需要
- **com.apple.security.app-sandbox**: App Store 应用必需

### DevX 应用需要的权限
- **网络访问**: 用于在线功能
- **文件访问**: 用于读写用户文件
- **JIT 编译**: 用于代码执行
- **自动化**: 用于系统集成

### 可选权限
- **摄像头访问**: `com.apple.security.device.camera`
- **麦克风访问**: `com.apple.security.device.microphone`
- **位置服务**: `com.apple.security.personal-information.location`
- **日历访问**: `com.apple.security.personal-information.calendars`
- **联系人访问**: `com.apple.security.personal-information.addressbook`

## 配置验证

### 1. 验证 Entitlements
```bash
# 查看应用的 entitlements
codesign -d --entitlements :- /path/to/your/app.app

# 验证 entitlements 格式
plutil -lint entitlements.plist
```

### 2. 验证签名
```bash
# 查看签名信息
codesign -dv --verbose=4 /path/to/your/app.app

# 验证签名
codesign --verify --verbose=4 /path/to/your/app.app
```

### 3. 测试沙盒
```bash
# 在沙盒环境中运行应用
sandbox-exec -f sandbox-profile.sb /path/to/your/app.app
```

## 常见问题

### Q: 权限被拒绝
A: 检查 entitlements 文件是否包含所需权限

### Q: 网络连接失败
A: 确保添加了 `com.apple.security.network.client`

### Q: 文件访问失败
A: 检查文件访问权限配置

### Q: JIT 编译失败
A: 确保添加了 `com.apple.security.cs.allow-jit`

### Q: 自动化功能失败
A: 检查 `com.apple.security.automation.apple-events` 权限

## 最佳实践

1. **最小权限原则**: 只添加应用真正需要的权限
2. **测试沙盒**: 在沙盒环境中测试所有功能
3. **文档化**: 记录每个权限的用途
4. **定期审查**: 定期检查权限使用情况
5. **安全更新**: 及时更新权限配置以适应新的安全要求

## 参考资源

- [Apple Entitlements Reference](https://developer.apple.com/library/archive/documentation/Miscellaneous/Reference/EntitlementKeyReference/Chapters/AboutEntitlements.html)
- [App Sandbox Design Guide](https://developer.apple.com/library/archive/documentation/Security/Conceptual/AppSandboxDesignGuide/AboutAppSandbox/AboutAppSandbox.html)
- [Code Signing Guide](https://developer.apple.com/support/code-signing/)
- [Tauri macOS Deployment](https://tauri.app/v2/guides/deployment/macos/) 