#!/bin/bash

# 设置 entitlements 脚本
# 用法: ./scripts/setup-entitlements.sh <TEAM_ID>
# 例如: ./scripts/setup-entitlements.sh ABC123DEF4

set -e

if [ $# -eq 0 ]; then
    echo "用法: $0 <TEAM_ID>"
    echo "例如: $0 ABC123DEF4"
    echo ""
    echo "获取 Team ID 的方法："
    echo "1. 登录 https://developer.apple.com"
    echo "2. 在右上角点击你的账户"
    echo "3. 查看 'Membership' 部分"
    echo "4. Team ID 格式类似：ABC123DEF4"
    exit 1
fi

TEAM_ID=$1
BUNDLE_ID="com.creep.devx.app"

echo "设置 entitlements 文件..."
echo "Team ID: $TEAM_ID"
echo "Bundle ID: $BUNDLE_ID"
echo ""

# 更新普通 entitlements 文件
echo "更新 src-tauri/entitlements.plist..."
sed -i.bak "s/TEAM_ID/$TEAM_ID/g" src-tauri/entitlements.plist
rm src-tauri/entitlements.plist.bak

# 更新 App Store entitlements 文件
echo "更新 src-tauri/entitlements.appstore.plist..."
sed -i.bak "s/TEAM_ID/$TEAM_ID/g" src-tauri/entitlements.appstore.plist
rm src-tauri/entitlements.appstore.plist.bak

# 更新 Tauri 配置文件
echo "更新 src-tauri/tauri.conf.json..."
sed -i.bak "s/TEAM_ID/$TEAM_ID/g" src-tauri/tauri.conf.json
rm src-tauri/tauri.conf.json.bak

# 更新 App Store Tauri 配置文件
echo "更新 src-tauri/tauri.appstore.conf.json..."
sed -i.bak "s/TEAM_ID/$TEAM_ID/g" src-tauri/tauri.appstore.conf.json
rm src-tauri/tauri.appstore.conf.json.bak

# 更新 provision profile 文件
echo "更新 src-tauri/embedded.provisionprofile..."
sed -i.bak "s/TEAM_ID/$TEAM_ID/g" src-tauri/embedded.provisionprofile
rm src-tauri/embedded.provisionprofile.bak

echo "✅ entitlements 文件设置完成！"
echo ""
echo "请确保在 GitHub Secrets 中设置了以下值："
echo "- APPLE_TEAM_ID: $TEAM_ID"
echo "- MACOS_P12_BASE64: <你的 p12 证书的 base64 编码>"
echo "- MACOS_P12_PASSWORD: <你的 p12 证书密码>"
echo "- APPLE_ID: <你的 Apple ID 邮箱>"
echo "- APPLE_ID_PASS: <你的 App 专用密码>"
echo ""
echo "重要提醒："
echo "1. 你需要从 Apple Developer 下载实际的 provision profile 文件"
echo "2. 将下载的 provision profile 替换 src-tauri/embedded.provisionprofile"
echo "3. 确保 provision profile 与你的 Bundle ID 和证书匹配"
echo ""
echo "下一步："
echo "1. 提交这些更改到 Git"
echo "2. 在 GitHub 仓库设置中添加 Secrets"
echo "3. 下载并替换 provision profile 文件"
echo "4. 测试构建和签名流程" 