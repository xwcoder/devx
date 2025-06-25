#!/bin/bash

# 发布脚本
# 用法: ./scripts/release.sh <version>
# 例如: ./scripts/release.sh 1.0.0

set -e

if [ $# -eq 0 ]; then
    echo "用法: $0 <version>"
    echo "例如: $0 1.0.0"
    exit 1
fi

VERSION=$1
TAG="v$VERSION"

echo "准备发布版本 $VERSION..."

# 检查是否在 git 仓库中
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "错误: 不在 git 仓库中"
    exit 1
fi

# 检查是否有未提交的更改
if ! git diff-index --quiet HEAD --; then
    echo "错误: 有未提交的更改，请先提交或暂存"
    exit 1
fi

# 更新 package.json 版本
echo "更新 package.json 版本..."
npm version $VERSION --no-git-tag-version

# 更新 Cargo.toml 版本
echo "更新 Cargo.toml 版本..."
sed -i.bak "s/^version = \".*\"/version = \"$VERSION\"/" src-tauri/Cargo.toml
rm src-tauri/Cargo.toml.bak

# 更新 tauri.conf.json 版本
echo "更新 tauri.conf.json 版本..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i.bak "s/\"version\": \".*\"/\"version\": \"$VERSION\"/" src-tauri/tauri.conf.json
    rm src-tauri/tauri.conf.json.bak
else
    # Linux/Windows
    sed -i "s/\"version\": \".*\"/\"version\": \"$VERSION\"/" src-tauri/tauri.conf.json
fi

# 更新 tauri.appstore.conf.json 版本
echo "更新 tauri.appstore.conf.json 版本..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i.bak "s/\"version\": \".*\"/\"version\": \"$VERSION\"/" src-tauri/tauri.appstore.conf.json
    rm src-tauri/tauri.appstore.conf.json.bak
else
    # Linux/Windows
    sed -i "s/\"version\": \".*\"/\"version\": \"$VERSION\"/" src-tauri/tauri.appstore.conf.json
fi

# 提交版本更新
echo "提交版本更新..."
git add package.json src-tauri/Cargo.toml src-tauri/tauri.conf.json src-tauri/tauri.appstore.conf.json
git commit -m "chore: bump version to $VERSION"

# 创建标签
echo "创建标签 $TAG..."
git tag $TAG

# 推送更改和标签
echo "推送更改和标签..."
git push origin main
git push origin $TAG

echo "✅ 发布准备完成！"
echo "版本 $VERSION 已创建并推送"
echo "GitHub Actions 将自动开始构建和发布流程" 