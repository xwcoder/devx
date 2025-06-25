#!/bin/bash

# DevX 图标生成脚本 (参考 iTerm2 风格)
# 使用 SVG 和 ImageMagick 生成图标

set -e

echo "🎨 生成 DevX 应用图标 (参考 iTerm2 风格)..."

# 检查 ImageMagick 是否安装
if ! command -v convert &> /dev/null; then
    echo "❌ 错误: 需要安装 ImageMagick"
    echo "macOS: brew install imagemagick"
    echo "Ubuntu: sudo apt-get install imagemagick"
    echo "Windows: 下载并安装 ImageMagick"
    exit 1
fi

# 创建图标目录
mkdir -p src-tauri/icons

# 创建 SVG 图标（参考 iTerm2 风格，扁平化简洁设计）
cat > devx-icon.svg << 'EOF'
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#2D3748;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1A202C;stop-opacity:1" />
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#000000" flood-opacity="0.3"/>
    </filter>
  </defs>
  
  <!-- 背景圆角矩形 (iTerm2 风格) -->
  <rect x="32" y="32" width="448" height="448" rx="64" ry="64" fill="url(#bg)" filter="url(#shadow)"/>
  
  <!-- 终端窗口主体 -->
  <rect x="96" y="120" width="320" height="272" rx="12" ry="12" fill="#1A202C" opacity="0.95"/>
  
  <!-- 终端标题栏 -->
  <rect x="96" y="120" width="320" height="40" rx="12" ry="12" fill="#2D3748"/>
  
  <!-- 终端控制按钮 -->
  <circle cx="120" cy="140" r="8" fill="#FC8181"/>
  <circle cx="144" cy="140" r="8" fill="#F6AD55"/>
  <circle cx="168" cy="140" r="8" fill="#68D391"/>
  
  <!-- 终端内容区域 -->
  <rect x="112" y="176" width="288" height="200" rx="8" ry="8" fill="#000000"/>
  
  <!-- 终端文本行 (模拟命令行) -->
  <rect x="128" y="192" width="256" height="12" rx="6" ry="6" fill="#E2E8F0" opacity="0.9"/>
  <rect x="128" y="212" width="200" height="12" rx="6" ry="6" fill="#E2E8F0" opacity="0.9"/>
  <rect x="128" y="232" width="240" height="12" rx="6" ry="6" fill="#E2E8F0" opacity="0.9"/>
  <rect x="128" y="252" width="180" height="12" rx="6" ry="6" fill="#E2E8F0" opacity="0.9"/>
  <rect x="128" y="272" width="220" height="12" rx="6" ry="6" fill="#E2E8F0" opacity="0.9"/>
  <rect x="128" y="292" width="160" height="12" rx="6" ry="6" fill="#E2E8F0" opacity="0.9"/>
  <rect x="128" y="312" width="260" height="12" rx="6" ry="6" fill="#E2E8F0" opacity="0.9"/>
  <rect x="128" y="332" width="140" height="12" rx="6" ry="6" fill="#E2E8F0" opacity="0.9"/>
  <rect x="128" y="352" width="200" height="12" rx="6" ry="6" fill="#E2E8F0" opacity="0.9"/>
  
  <!-- 命令提示符 (绿色) -->
  <rect x="128" y="192" width="16" height="12" rx="6" ry="6" fill="#68D391" opacity="0.9"/>
  <rect x="128" y="232" width="16" height="12" rx="6" ry="6" fill="#68D391" opacity="0.9"/>
  <rect x="128" y="272" width="16" height="12" rx="6" ry="6" fill="#68D391" opacity="0.9"/>
  <rect x="128" y="312" width="16" height="12" rx="6" ry="6" fill="#68D391" opacity="0.9"/>
  
  <!-- 光标 -->
  <rect x="144" y="192" width="2" height="12" fill="#E2E8F0" opacity="0.9">
    <animate attributeName="opacity" values="0.9;0;0.9" dur="1s" repeatCount="indefinite"/>
  </rect>
  
  <!-- 装饰性元素 (扁平化) -->
  <rect x="80" y="80" width="24" height="24" rx="12" ry="12" fill="#4A5568" opacity="0.6"/>
  <rect x="408" y="80" width="16" height="16" rx="8" ry="8" fill="#4A5568" opacity="0.4"/>
  <rect x="80" y="408" width="16" height="16" rx="8" ry="8" fill="#4A5568" opacity="0.4"/>
  <rect x="408" y="408" width="24" height="24" rx="12" ry="12" fill="#4A5568" opacity="0.6"/>
</svg>
EOF

echo "🎨 生成基础图标..."

# 生成不同尺寸的 PNG 图标
sizes=(
    "16:16x16.png"
    "32:32x32.png"
    "48:48x48.png"
    "64:64x64.png"
    "128:128x128.png"
    "256:256x256.png"
    "512:512x512.png"
)

for size_info in "${sizes[@]}"; do
    IFS=':' read -r size filename <<< "$size_info"
    echo "生成 ${size}x${size} 图标..."
    convert devx-icon.svg -resize "${size}x${size}" "src-tauri/icons/${filename}"
done

# 生成高分辨率图标
echo "生成高分辨率图标..."
convert devx-icon.svg -resize "256x256" "src-tauri/icons/128x128@2x.png"

# 生成 Windows ICO 文件
echo "生成 Windows 图标..."
convert devx-icon.svg -resize "256x256" "src-tauri/icons/icon.ico"

# 生成 macOS ICNS 文件
echo "生成 macOS 图标..."
convert devx-icon.svg -resize "512x512" "src-tauri/icons/icon.icns"

# 生成 App Store 图标
echo "生成 App Store 图标..."
appstore_sizes=(
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

for size_info in "${appstore_sizes[@]}"; do
    IFS=':' read -r size filename <<< "$size_info"
    echo "生成 App Store 图标 ${size}x${size}..."
    convert devx-icon.svg -resize "${size}x${size}" "src-tauri/icons/${filename}"
done

# 生成 Store Logo
convert devx-icon.svg -resize "1024x1024" "src-tauri/icons/StoreLogo.png"

# 清理临时文件
rm devx-icon.svg

echo "✅ 图标生成完成！"
echo "📁 图标文件保存在: src-tauri/icons/"
echo ""
echo "🎨 图标设计特点 (参考 iTerm2 风格):"
echo "   - 主色调: 深灰色渐变 (#2D3748 -> #1A202C)"
echo "   - 主题: 终端窗口界面"
echo "   - 风格: 扁平化、简洁现代"
echo "   - 元素: 终端标题栏、命令行、绿色提示符"
echo "   - 动画: 闪烁光标效果" 