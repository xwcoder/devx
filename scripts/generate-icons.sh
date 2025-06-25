#!/bin/bash

# DevX 图标生成脚本
# 生成符合开发工具主题的蓝色/黑色图标

set -e

echo "🎨 生成 DevX 应用图标..."

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 需要安装 Node.js"
    exit 1
fi

# 检查是否安装了必要的 npm 包
if [ ! -f "node_modules/canvas/package.json" ]; then
    echo "📦 安装 canvas 依赖..."
    npm install canvas
fi

# 创建图标生成脚本
cat > generate-icons.js << 'EOF'
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

// 创建图标目录
const iconDir = path.join(__dirname, 'src-tauri', 'icons');
if (!fs.existsSync(iconDir)) {
    fs.mkdirSync(iconDir, { recursive: true });
}

// 定义颜色方案 - 开发工具主题
const colors = {
    primary: '#2563eb',      // 蓝色主色调
    secondary: '#1e40af',    // 深蓝色
    accent: '#3b82f6',       // 亮蓝色
    dark: '#1f2937',         // 深灰色
    light: '#f8fafc',        // 浅灰色
    white: '#ffffff'         // 白色
};

// 生成图标的函数
function generateIcon(size, filename) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    // 设置背景
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, colors.primary);
    gradient.addColorStop(1, colors.secondary);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    
    // 添加圆角
    ctx.globalCompositeOperation = 'destination-in';
    ctx.beginPath();
    ctx.roundRect(0, 0, size, size, size * 0.2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    
    // 绘制开发工具图标元素
    const centerX = size / 2;
    const centerY = size / 2;
    const iconSize = size * 0.6;
    
    // 绘制代码块背景
    ctx.fillStyle = colors.dark;
    ctx.fillRect(centerX - iconSize * 0.4, centerY - iconSize * 0.3, iconSize * 0.8, iconSize * 0.6);
    
    // 绘制代码行
    ctx.fillStyle = colors.white;
    const lineHeight = iconSize * 0.08;
    const lineWidth = iconSize * 0.6;
    
    // 第一行代码
    ctx.fillRect(centerX - lineWidth * 0.5, centerY - lineHeight * 1.5, lineWidth * 0.7, lineHeight * 0.6);
    
    // 第二行代码（缩进）
    ctx.fillRect(centerX - lineWidth * 0.3, centerY - lineHeight * 0.5, lineWidth * 0.5, lineHeight * 0.6);
    
    // 第三行代码（缩进）
    ctx.fillRect(centerX - lineWidth * 0.3, centerY + lineHeight * 0.5, lineWidth * 0.6, lineHeight * 0.6);
    
    // 第四行代码
    ctx.fillRect(centerX - lineWidth * 0.5, centerY + lineHeight * 1.5, lineWidth * 0.4, lineHeight * 0.6);
    
    // 添加高亮效果
    ctx.fillStyle = colors.accent;
    ctx.globalAlpha = 0.3;
    ctx.fillRect(centerX - lineWidth * 0.5, centerY - lineHeight * 1.5, lineWidth * 0.2, lineHeight * 0.6);
    ctx.globalAlpha = 1;
    
    // 保存图标
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(path.join(iconDir, filename), buffer);
    console.log(`✅ 生成图标: ${filename} (${size}x${size})`);
}

// 生成不同尺寸的图标
const sizes = [
    { size: 16, filename: '16x16.png' },
    { size: 32, filename: '32x32.png' },
    { size: 48, filename: '48x48.png' },
    { size: 64, filename: '64x64.png' },
    { size: 128, filename: '128x128.png' },
    { size: 256, filename: '256x256.png' },
    { size: 512, filename: '512x512.png' }
];

console.log('🎨 开始生成图标...');
sizes.forEach(({ size, filename }) => {
    generateIcon(size, filename);
});

// 生成高分辨率图标
console.log('🎨 生成高分辨率图标...');
generateIcon(256, '128x128@2x.png');

// 生成 Windows 图标
console.log('🎨 生成 Windows 图标...');
generateIcon(256, 'icon.ico');

// 生成 macOS 图标
console.log('🎨 生成 macOS 图标...');
generateIcon(512, 'icon.icns');

// 生成 App Store 图标
console.log('🎨 生成 App Store 图标...');
const appStoreSizes = [
    { size: 30, filename: 'Square30x30Logo.png' },
    { size: 44, filename: 'Square44x44Logo.png' },
    { size: 71, filename: 'Square71x71Logo.png' },
    { size: 89, filename: 'Square89x89Logo.png' },
    { size: 107, filename: 'Square107x107Logo.png' },
    { size: 142, filename: 'Square142x142Logo.png' },
    { size: 150, filename: 'Square150x150Logo.png' },
    { size: 284, filename: 'Square284x284Logo.png' },
    { size: 310, filename: 'Square310x310Logo.png' }
];

appStoreSizes.forEach(({ size, filename }) => {
    generateIcon(size, filename);
});

// 生成 Store Logo
generateIcon(1024, 'StoreLogo.png');

console.log('✅ 所有图标生成完成！');
console.log('📁 图标保存在: src-tauri/icons/');
EOF

# 运行图标生成脚本
echo "🚀 运行图标生成脚本..."
node generate-icons.js

# 清理临时文件
rm generate-icons.js

echo "✅ 图标生成完成！"
echo "📁 图标文件保存在: src-tauri/icons/"
echo ""
echo "🎨 图标设计特点:"
echo "   - 主色调: 蓝色渐变 (#2563eb -> #1e40af)"
echo "   - 主题: 开发工具代码编辑器"
echo "   - 风格: 现代简约，圆角设计"
echo "   - 元素: 代码块和代码行" 