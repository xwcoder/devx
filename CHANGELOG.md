# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial release of DevX
- Code beautification tools (JSON, HTML, CSS, JavaScript, XML, YAML)
- Base64 encoding/decoding
- URL encoding/decoding
- Modern UI with Tailwind CSS
- Cross-platform desktop application using Tauri
- macOS DMG installer packages for better user experience
- Complete CI/CD pipeline with GitHub Actions
- Automated release process with multi-platform builds
- macOS code signing and notarization support
- App Store distribution configuration
- macOS application category configuration (Developer Tools)
- Comprehensive App Store setup documentation
- Complete entitlements configuration with application identifier and team identifier
- Automated entitlements setup script
- Detailed entitlements configuration guide
- Provision profile configuration for enhanced code signing
- Provision profile setup guide and automation
- Enhanced security configuration for macOS applications
- Added GitHub Actions provision profile support
- Added `scripts/setup-provision-profile.sh` script for automatic provision profile generation
- Added `docs/github-actions-provision-profile.md` for detailed configuration guide
- Added provision profile verification step in GitHub Actions workflow

### Changed
- Optimized GitHub Actions workflow to support automatic and manual provision profile generation
- Improved error handling and logging for clearer build status information
- Simplified provision profile configuration process to support reading from GitHub Secrets

### Deprecated

### Removed

### Fixed
- Fixed YAML format issue in GitHub Actions workflow
- Ensured provision profile file is correctly set up during build process

### Security

## [0.1.0] - 2024-01-01

### Added
- Initial release
- Basic code formatting tools
- Desktop application for Windows, macOS, and Linux 

## [未发布]

### 新增
- 添加 GitHub Actions 中的 provision profile 自动处理
- 新增 `scripts/setup-provision-profile.sh` 脚本，用于自动生成 provision profile
- 新增 `docs/github-actions-provision-profile.md` 详细配置指南
- 在 GitHub Actions 工作流中添加 provision profile 验证步骤
- 新增 `scripts/test-version-update.sh` 测试脚本，用于验证版本更新功能

### 改进
- 优化 GitHub Actions 工作流，支持自动生成和手动配置 provision profile
- 改进错误处理和日志输出，提供更清晰的构建状态信息
- 简化 provision profile 配置流程，支持从 GitHub Secrets 读取
- **重要改进**：更新 `scripts/release.sh` 脚本，现在会自动更新所有版本文件：
  - `package.json` 版本
  - `src-tauri/Cargo.toml` 版本
  - `src-tauri/tauri.conf.json` 版本
  - `src-tauri/tauri.appstore.conf.json` 版本
- 改进发布流程，确保所有配置文件版本一致
- 更新 `RELEASE.md` 文档，提供更详细的发布指南

### 修复
- 修复 GitHub Actions 工作流中的 YAML 格式问题
- 确保 provision profile 文件在构建过程中正确设置
- 修复版本更新脚本中缺少 Tauri 配置文件更新的问题 