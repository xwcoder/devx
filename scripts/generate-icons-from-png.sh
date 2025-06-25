#!/bin/bash

# 使用 devx-icon.png 生成所有平台 icon 并替换
# 请确保 devx-icon.png 已放在项目根目录

set -e

ICON_SRC="devx-icon.png"
ICON_DIR="src-tauri/icons"

if [ ! -f "$ICON_SRC" ]; then
  echo "❌ 未找到 $ICON_SRC，请将你的图标图片命名为 devx-icon.png 并放在项目根目录。"
  exit 1
fi

mkdir -p $ICON_DIR

# 生成常用尺寸 PNG
sizes=(16 32 48 64 128 256 512)
for size in "${sizes[@]}"; do
  echo "生成 ${size}x${size}.png ..."
  convert "$ICON_SRC" -resize ${size}x${size} -define png:color-type=6 "$ICON_DIR/${size}x${size}.png"
done

# 生成高分辨率
convert "$ICON_SRC" -resize 256x256 -define png:color-type=6 "$ICON_DIR/128x128@2x.png"

# 生成 Windows ICO
convert "$ICON_SRC" -resize 256x256 "$ICON_DIR/icon.ico"

# 生成 macOS ICNS
convert "$ICON_SRC" -resize 512x512 "$ICON_DIR/icon.icns"

# 生成 App Store 相关尺寸（Square* 图标）
square_sizes=(
  "30:Square30x30Logo.png"
  "44:Square44x44Logo.png"
  "71:Square71x71Logo.png"
  "89:Square89x89Logo.png"
  "107:Square107x107Logo.png"
  "142:Square142x142Logo.png"
  "150:Square150x150Logo.png"
  "284:Square284x284Logo.png"
  "310:Square310x310Logo.png"
)
for item in "${square_sizes[@]}"; do
  size=${item%%:*}
  fname=${item#*:}
  echo "生成 $fname ..."
  convert "$ICON_SRC" -resize ${size}x${size} -define png:color-type=6 "$ICON_DIR/$fname"
done

# 生成 Store Logo
convert "$ICON_SRC" -resize 1024x1024 -define png:color-type=6 "$ICON_DIR/StoreLogo.png"

echo "✅ 所有平台 icon 已生成并替换！"
echo "📁 图标文件保存在: $ICON_DIR/" 