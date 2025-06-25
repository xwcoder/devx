# macOS 应用分类指南

macOS 应用分类定义了应用在 Dock、Launchpad 和 App Store 中的显示位置。

## 可用的分类选项

### 主要分类

| 分类值 | 显示名称 | 描述 |
|--------|----------|------|
| `public.app-category.developer-tools` | 开发者工具 | 编程、开发相关工具 |
| `public.app-category.productivity` | 效率 | 办公、生产力工具 |
| `public.app-category.utilities` | 实用工具 | 系统工具、实用程序 |
| `public.app-category.graphics-design` | 图形与设计 | 设计、图像处理软件 |
| `public.app-category.social-networking` | 社交 | 社交媒体应用 |
| `public.app-category.entertainment` | 娱乐 | 游戏、娱乐应用 |
| `public.app-category.education` | 教育 | 学习、教育软件 |
| `public.app-category.finance` | 财务 | 金融、理财应用 |
| `public.app-category.medical` | 医疗 | 医疗健康应用 |
| `public.app-category.news` | 新闻 | 新闻、资讯应用 |
| `public.app-category.photography` | 摄影 | 照片、视频编辑 |
| `public.app-category.music` | 音乐 | 音乐播放、制作 |
| `public.app-category.video` | 视频 | 视频播放、编辑 |
| `public.app-category.sports` | 体育 | 运动、健身应用 |
| `public.app-category.travel` | 旅游 | 旅行、导航应用 |
| `public.app-category.lifestyle` | 生活 | 生活方式应用 |
| `public.app-category.food-drink` | 美食佳饮 | 餐饮、食谱应用 |
| `public.app-category.shopping` | 购物 | 电商、购物应用 |
| `public.app-category.weather` | 天气 | 天气、气候应用 |
| `public.app-category.reference` | 参考 | 字典、百科全书等 |
| `public.app-category.business` | 商务 | 商业、企业应用 |
| `public.app-category.navigation` | 导航 | 地图、导航应用 |
| `public.app-category.books` | 图书 | 电子书、阅读应用 |

## DevX 应用分类

DevX 是一个开发者工具集，提供代码格式化、编码转换等功能，因此使用：

```json
{
  "macOS": {
    "category": "public.app-category.developer-tools"
  }
}
```

## 配置位置

分类配置在两个文件中：

1. **`src-tauri/tauri.conf.json`** - 普通发布配置
2. **`src-tauri/tauri.appstore.conf.json`** - App Store 发布配置

## 分类的影响

### 1. Dock 显示
- 应用在 Dock 中会显示在对应的分类文件夹中
- 用户可以通过分类快速找到应用

### 2. Launchpad 显示
- 在 Launchpad 中按分类组织应用
- 提供更好的应用发现体验

### 3. App Store 分类
- 在 App Store 中显示在对应的分类页面
- 影响应用的搜索和推荐

### 4. Spotlight 搜索
- 影响 Spotlight 搜索结果的分类
- 提供更准确的搜索体验

## 自定义分类

如果需要使用自定义分类，可以：

1. 在 `Info.plist` 中设置 `LSApplicationCategoryType`
2. 使用标准的分类值
3. 确保分类与应用功能匹配

## 最佳实践

1. **选择合适的分类**: 确保分类与应用功能匹配
2. **保持一致性**: 在 App Store 和本地安装中使用相同分类
3. **考虑用户体验**: 选择用户容易找到的分类
4. **遵循 Apple 指南**: 使用 Apple 推荐的标准分类值

## 参考资源

- [Apple App Categories](https://developer.apple.com/app-store/categories/)
- [macOS App Categories](https://developer.apple.com/library/archive/documentation/General/Reference/InfoPlistKeyReference/Articles/LaunchServicesKeys.html#//apple_ref/doc/uid/TP40009250-SW8)
- [Tauri macOS Configuration](https://tauri.app/v2/guides/building/macos/) 