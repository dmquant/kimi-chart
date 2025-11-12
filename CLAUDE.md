# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 在处理此仓库代码时提供指导。

## 项目概述

基于 Next.js 16、Excalidraw 和月之暗面 Kimi K2 模型的 AI 白板编辑器。用户用自然语言描述图表,AI 生成流程图、系统架构图等可视化内容。

## 开发命令

```bash
# 安装依赖
npm install

# 运行开发服务器 (localhost:3000)
npm run dev

# 生产环境构建
npm run build

# 启动生产服务器
npm start

# 代码检查
npm run lint
```

## 环境配置

`.env` 中需要配置环境变量（支持多 AI provider）:

```env
# 默认使用 Moonshot (推荐)
AI_PROVIDER=moonshot
MOONSHOT_API_KEY=your_moonshot_api_key_here

# 可选：OpenAI
# AI_PROVIDER=openai
# OPENAI_API_KEY=your_openai_api_key_here

# 可选：Anthropic
# AI_PROVIDER=anthropic
# ANTHROPIC_API_KEY=your_anthropic_api_key_here

# 可选：DeepSeek
# AI_PROVIDER=deepseek
# DEEPSEEK_API_KEY=your_deepseek_api_key_here
```

获取 API 密钥:
- Moonshot (默认): https://platform.moonshot.cn/
- OpenAI: https://platform.openai.com/
- Anthropic: https://console.anthropic.com/
- DeepSeek: https://platform.deepseek.com/

## 架构

### 数据流

1. 用户在 [AIPromptInterface.tsx](src/components/AIPromptInterface.tsx) 输入提示词
2. POST 请求到 [/api/generate-shapes](src/app/api/generate-shapes/route.ts) 通过 provider 抽象层调用 AI API
3. AI 返回包含形状定义的 JSON (矩形、菱形、椭圆、箭头)
4. [excalidrawUtils.ts](src/lib/excalidrawUtils.ts) 将 AI 元素转换为 Excalidraw 格式
5. [Whiteboard.tsx](src/components/Whiteboard.tsx) 用新元素更新画布

### 核心组件

- **[Whiteboard.tsx](src/components/Whiteboard.tsx)**: 主集成组件,管理 Excalidraw API,处理保存/加载/导出
- **[AIPromptInterface.tsx](src/components/AIPromptInterface.tsx)**: 提示词输入界面,以 3 列网格布局放置形状 (水平间距 250px,垂直间距 300px)
- **[ExcalidrawWrapper.tsx](src/components/ExcalidrawWrapper.tsx)**: 客户端 Excalidraw 初始化的动态包装器
- **[aiProvider.ts](src/lib/aiProvider.ts)**: AI provider 抽象层,支持 Moonshot/OpenAI/Anthropic/DeepSeek

### AI 集成

- **默认模型**: Moonshot `kimi-k2-thinking` (推荐)
- **支持 providers**: OpenAI, Anthropic, DeepSeek (通过 `AI_PROVIDER` 环境变量切换)
- **API 路由**: [src/app/api/generate-shapes/route.ts](src/app/api/generate-shapes/route.ts)
- **Provider 抽象**: [src/lib/aiProvider.ts](src/lib/aiProvider.ts) 统一处理不同 API 格式
- **响应格式**: 包含元素数组的 JSON (类型、文本、宽度、高度)
- **验证**: 使用 Zod schemas 保证类型安全

### 元素转换逻辑

[excalidrawUtils.ts](src/lib/excalidrawUtils.ts) 处理:

- **形状类型**: rectangle (蓝色)、diamond (黄色/橙色)、ellipse (起止用绿色,其他用紫色)
- **自动箭头生成**: 如果 AI 未提供箭头,自动垂直连接形状 (从第 n 行到第 n+1 行)
- **标签系统**: 形状使用 `label` 属性显示居中文本
- **样式**: 每种形状类型预定义颜色和描边宽度

### 网格布局系统

形状以 3 列网格布局:

- **X 位置**: `300 + (index % 3) * 250`
- **Y 位置**: `200 + Math.floor(index / 3) * 300`
- **箭头定位**: 在形状中心,连接行与行之间

## TypeScript 配置

- 路径别名: `@/*` 映射到 `./src/*`
- JSX: `react-jsx` 模式 (无需显式导入 React)
- 目标: ES2017
- 已启用严格模式

## 常见开发模式

### 添加新 AI Provider

1. 在 [aiProvider.ts](src/lib/aiProvider.ts) 的 `getAIProviderConfig()` 中添加新 case
2. 如果 API 格式不兼容 OpenAI,在 `callAICompletion()` 中添加特殊处理 (参考 Anthropic 实现)
3. 更新 `.env.example` 添加新 provider 配置

### 添加新形状类型

1. 更新 [route.ts](src/app/api/generate-shapes/route.ts) 中的 Zod schema
2. 在 [excalidrawUtils.ts](src/lib/excalidrawUtils.ts) 的 `convertAIElementsToExcalidraw` 函数中添加样式 case
3. 更新 AI 提示词系统消息以识别新类型

### 修改 AI 行为

编辑 [route.ts](src/app/api/generate-shapes/route.ts):32-57 中的系统消息和示例

### 调试元素渲染

整个流程的控制台日志:

- API 响应: `route.ts` 第 87-121 行
- 元素转换: `excalidrawUtils.ts` 第 26, 50, 103, 144, 172, 178, 183 行
- 场景更新: `AIPromptInterface.tsx` 第 31, 34, 48, 68, 74 行和 `Whiteboard.tsx` 第 20-43 行

## 依赖项

- **@excalidraw/excalidraw**: 白板画布,必须动态导入 (使用浏览器 API)
- **@ai-sdk/openai**: 未主动使用 (脚手架遗留)
- **ai**: Vercel AI SDK (未主动使用,直接 fetch 到 Moonshot API)
- **zod**: AI 响应的运行时验证

## 仅客户端组件

Excalidraw 需要 `window` 对象。所有使用它的组件必须是客户端组件 (`'use client'` 指令)。[ExcalidrawWrapper.tsx](src/components/ExcalidrawWrapper.tsx) 处理动态导入。
