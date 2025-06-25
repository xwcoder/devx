#!/bin/bash

# 设置 provision profile 脚本
# 用于在 GitHub Actions 中生成默认的 provision profile

set -e

TEAM_ID="${APPLE_TEAM_ID:-$1}"
BUNDLE_ID="${BUNDLE_ID:-com.creep.devx.app}"

if [ -z "$TEAM_ID" ]; then
    echo "❌ 错误: 需要提供 APPLE_TEAM_ID"
    echo "用法: $0 <TEAM_ID> [BUNDLE_ID]"
    exit 1
fi

echo "🔧 生成 provision profile..."
echo "Team ID: $TEAM_ID"
echo "Bundle ID: $BUNDLE_ID"

# 生成 provision profile 文件
cat > src-tauri/embedded.provisionprofile << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>AppIDName</key>
	<string>DevX</string>
	<key>ApplicationIdentifierPrefix</key>
	<array>
		<string>$TEAM_ID</string>
	</array>
	<key>CreationDate</key>
	<date>$(date -u +%Y-%m-%dT%H:%M:%SZ)</date>
	<key>Entitlements</key>
	<dict>
		<key>application-identifier</key>
		<string>\$(AppIdentifierPrefix)$BUNDLE_ID</string>
		<key>com.apple.developer.team-identifier</key>
		<string>$TEAM_ID</string>
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
	<date>$(date -u -d '+1 year' +%Y-%m-%dT%H:%M:%SZ)</date>
	<key>Name</key>
	<string>DevX Mac App Distribution</string>
	<key>Platform</key>
	<array>
		<string>macOS</string>
	</array>
	<key>TeamIdentifier</key>
	<array>
		<string>$TEAM_ID</string>
	</array>
	<key>TeamName</key>
	<string>DevX Team</string>
	<key>TimeToLive</key>
	<integer>365</integer>
	<key>UUID</key>
	<string>$(uuidgen)</string>
	<key>Version</key>
	<integer>1</integer>
</dict>
</plist>
EOF

echo "✅ Provision profile 生成成功: src-tauri/embedded.provisionprofile"

# 验证文件
if [ -f "src-tauri/embedded.provisionprofile" ]; then
    echo "📋 Provision profile 信息:"
    plutil -p src-tauri/embedded.provisionprofile | grep -E "(Name|AppIDName|TeamIdentifier|ExpirationDate)" || true
else
    echo "❌ Provision profile 生成失败"
    exit 1
fi 