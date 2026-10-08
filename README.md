# 杨子豪个人作品集

视觉设计师 / AI 设计师 / 品牌设计师个人作品集网站。

## 本地运行

需要 Node.js 22.13 或更高版本。

```bash
npm install
npm run dev
```

打开终端显示的本地地址即可预览。生产构建：

```bash
npm run build
```

## 技术与内容

- React + Vite（Vinext）
- 单页响应式作品集，桌面端版心最大 1700px
- 首页循环视频由个人作品画面制作
- 项目图片已生成 WebP 展示版本，外部原始文件不会被修改
- 联系方式、经历与项目介绍来自本人简历和作品集

主要页面内容位于 `app/page.tsx`，全局视觉样式位于 `app/globals.css`，展示素材位于 `public/media`。
