#!/bin/bash

# 版本一致性检查脚本
# 用于检查所有版本文件是否一致

set -e

echo "🔍 检查版本一致性..."

# 获取各个文件的版本
PACKAGE_VERSION=$(grep '"version"' package.json | sed 's/.*"version": "\([^"]*\)".*/\1/')
CARGO_VERSION=$(grep '^version =' src-tauri/Cargo.toml | sed 's/.*version = "\([^"]*\)".*/\1/')
TAURI_VERSION=$(grep '"version"' src-tauri/tauri.conf.json | sed 's/.*"version": "\([^"]*\)".*/\1/')
APPSTORE_VERSION=$(grep '"version"' src-tauri/tauri.appstore.conf.json | sed 's/.*"version": "\([^"]*\)".*/\1/')

echo "📋 当前版本信息:"
echo "   package.json: $PACKAGE_VERSION"
echo "   Cargo.toml: $CARGO_VERSION"
echo "   tauri.conf.json: $TAURI_VERSION"
echo "   tauri.appstore.conf.json: $APPSTORE_VERSION"

# 检查是否所有版本一致
if [ "$PACKAGE_VERSION" = "$CARGO_VERSION" ] && \
   [ "$CARGO_VERSION" = "$TAURI_VERSION" ] && \
   [ "$TAURI_VERSION" = "$APPSTORE_VERSION" ]; then
    echo ""
    echo "✅ 所有版本一致！"
    echo "   当前版本: $PACKAGE_VERSION"
    exit 0
else
    echo ""
    echo "❌ 版本不一致！"
    echo "   期望所有文件版本相同"
    exit 1
fi 