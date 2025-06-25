#!/bin/bash

# 测试版本更新脚本
# 用于验证 release.sh 脚本的版本更新功能

set -e

echo "🧪 测试版本更新功能..."

# 创建临时目录
TEMP_DIR=$(mktemp -d)
echo "创建临时目录: $TEMP_DIR"

# 复制项目文件到临时目录
cp -r . "$TEMP_DIR/"
cd "$TEMP_DIR"

echo "📁 当前工作目录: $(pwd)"

# 显示原始版本
echo "📋 原始版本信息:"
echo "package.json: $(grep '"version"' package.json)"
echo "Cargo.toml: $(grep '^version =' src-tauri/Cargo.toml)"
echo "tauri.conf.json: $(grep '"version"' src-tauri/tauri.conf.json)"
echo "tauri.appstore.conf.json: $(grep '"version"' src-tauri/tauri.appstore.conf.json)"

# 测试版本更新
TEST_VERSION="1.2.3"
echo ""
echo "🔄 测试更新到版本 $TEST_VERSION..."

# 更新 package.json
npm version $TEST_VERSION --no-git-tag-version

# 更新 Cargo.toml
if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i.bak "s/^version = \".*\"/version = \"$TEST_VERSION\"/" src-tauri/Cargo.toml
    rm src-tauri/Cargo.toml.bak
else
    sed -i "s/^version = \".*\"/version = \"$TEST_VERSION\"/" src-tauri/Cargo.toml
fi

# 更新 tauri.conf.json
if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i.bak "s/\"version\": \".*\"/\"version\": \"$TEST_VERSION\"/" src-tauri/tauri.conf.json
    rm src-tauri/tauri.conf.json.bak
else
    sed -i "s/\"version\": \".*\"/\"version\": \"$TEST_VERSION\"/" src-tauri/tauri.conf.json
fi

# 更新 tauri.appstore.conf.json
if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i.bak "s/\"version\": \".*\"/\"version\": \"$TEST_VERSION\"/" src-tauri/tauri.appstore.conf.json
    rm src-tauri/tauri.appstore.conf.json.bak
else
    sed -i "s/\"version\": \".*\"/\"version\": \"$TEST_VERSION\"/" src-tauri/tauri.appstore.conf.json
fi

# 显示更新后的版本
echo ""
echo "📋 更新后的版本信息:"
echo "package.json: $(grep '"version"' package.json)"
echo "Cargo.toml: $(grep '^version =' src-tauri/Cargo.toml)"
echo "tauri.conf.json: $(grep '"version"' src-tauri/tauri.conf.json)"
echo "tauri.appstore.conf.json: $(grep '"version"' src-tauri/tauri.appstore.conf.json)"

# 验证所有版本是否一致
echo ""
echo "🔍 验证版本一致性..."

PACKAGE_VERSION=$(grep '"version"' package.json | sed 's/.*"version": "\([^"]*\)".*/\1/')
CARGO_VERSION=$(grep '^version =' src-tauri/Cargo.toml | sed 's/.*version = "\([^"]*\)".*/\1/')
TAURI_VERSION=$(grep '"version"' src-tauri/tauri.conf.json | sed 's/.*"version": "\([^"]*\)".*/\1/')
APPSTORE_VERSION=$(grep '"version"' src-tauri/tauri.appstore.conf.json | sed 's/.*"version": "\([^"]*\)".*/\1/')

if [ "$PACKAGE_VERSION" = "$TEST_VERSION" ] && \
   [ "$CARGO_VERSION" = "$TEST_VERSION" ] && \
   [ "$TAURI_VERSION" = "$TEST_VERSION" ] && \
   [ "$APPSTORE_VERSION" = "$TEST_VERSION" ]; then
    echo "✅ 所有版本更新成功且一致！"
    echo "   package.json: $PACKAGE_VERSION"
    echo "   Cargo.toml: $CARGO_VERSION"
    echo "   tauri.conf.json: $TAURI_VERSION"
    echo "   tauri.appstore.conf.json: $APPSTORE_VERSION"
else
    echo "❌ 版本更新失败或不一致！"
    echo "   期望版本: $TEST_VERSION"
    echo "   package.json: $PACKAGE_VERSION"
    echo "   Cargo.toml: $CARGO_VERSION"
    echo "   tauri.conf.json: $TAURI_VERSION"
    echo "   tauri.appstore.conf.json: $APPSTORE_VERSION"
    exit 1
fi

# 清理临时目录
echo ""
echo "🧹 清理临时目录..."
cd ..
rm -rf "$TEMP_DIR"

echo "✅ 测试完成！" 