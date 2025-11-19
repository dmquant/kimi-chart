# 🎨 AI Whiteboard Editor | AI 白板编辑器

## English | [中文](#中文)

An AI-powered whiteboard editor built with Next.js, Excalidraw, and Google Gemini. Describe what you want to draw in natural language, and watch the AI generate diagrams, flowcharts, and shapes on the fly!

一个由 Next.js、Excalidraw 和 Google Gemini 驱动的 AI 白板编辑器。用自然语言描述你想绘制的内容，观看 AI 实时生成图表、流程图和形状！

---

## ✨ Features | 功能特性

- **🤖 AI-Powered Generation**: Generate diagrams, flowcharts, and shapes from natural language descriptions
  **AI 智能生成**：通过自然语言描述生成图表、流程图和形状

- **🎨 Full Excalidraw Integration**: All the powerful features of Excalidraw at your fingertips
  **完整的 Excalidraw 集成**：触手可及的 Excalidraw 强大功能

- **💾 Export Options**: Save as PNG or Excalidraw format
  **多种导出选项**：保存为 PNG 或 Excalidraw 格式

- **📂 Load & Save**: Store your whiteboards locally and load them later
  **加载与保存**：本地存储白板并随时加载

- **📱 Responsive UI**: Clean, modern interface with Tailwind CSS
  **响应式界面**：使用 Tailwind CSS 的简洁现代界面

- **⚡ Real-time Editing**: Interactive whiteboard with full drawing capabilities
  **实时编辑**：具有完整绘图功能的交互式白板

- **🔗 Auto-Arrow Generation**: Automatically generates arrows between shapes for flowcharts
  **自动箭头生成**：自动在形状之间生成箭头以创建流程图

---

## 🚀 Quick Start | 快速开始

### Prerequisites | 环境要求

- Node.js 18+
- npm or yarn or pnpm
- AI API key (choose one):
  - **Google Gemini** (Recommended) - [Get one here](https://aistudio.google.com/) | Google Gemini（推荐）- [在此获取](https://aistudio.google.com/)
  - Moonshot AI - [Get one here](https://platform.moonshot.cn/)
  - OpenAI - [Get one here](https://platform.openai.com/)
  - Anthropic - [Get one here](https://console.anthropic.com/)
  - DeepSeek - [Get one here](https://platform.deepseek.com/)

### Installation | 安装步骤

1. **Navigate to the project | 进入项目目录：**

```bash
cd /Users/daoming/prog/test/kimi/app/whiteboard/ai-whiteboard
```

2. **Set up environment variables | 配置环境变量：**

Create a `.env` file in the project root | 在项目根目录创建 `.env` 文件：

```bash
cp .env.example .env
```

Edit `.env` and configure your AI provider | 编辑 `.env` 并配置您的 AI 提供商：

**Option 1: Google Gemini (Default & Recommended) | 选项 1：Google Gemini（默认推荐）**
```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key_here
```

**Option 2: Moonshot AI | 选项 2：月之暗面**
```env
AI_PROVIDER=moonshot
MOONSHOT_API_KEY=your_moonshot_api_key_here
```

**Option 3: OpenAI | 选项 3：OpenAI**
```env
AI_PROVIDER=openai
OPENAI_API_KEY=your_openai_api_key_here
```

**Option 4: Anthropic Claude | 选项 4：Anthropic Claude**
```env
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

**Option 5: DeepSeek | 选项 5：DeepSeek**
```env
AI_PROVIDER=deepseek
DEEPSEEK_API_KEY=your_deepseek_api_key_here
```

3. **Run the development server | 运行开发服务器：**

```bash
npm run dev
```

4. **Open your browser | 打开浏览器：**

Navigate to [http://localhost:3000](http://localhost:3000) to see the AI Whiteboard Editor! | 访问 [http://localhost:3000](http://localhost:3000) 查看 AI 白板编辑器！

---

## 🎯 How to Use | 使用指南

### Generating AI Shapes | 生成 AI 形状

1. **Type a description | 输入描述：**
   - Example: "Create a flowchart for user registration with 3 steps" | 示例："创建一个包含 3 个步骤的用户注册流程图"
   - Example: "Draw a system architecture with frontend, backend, and database" | 示例："绘制包含前端、后端和数据库的系统架构图"
   - Example: "Create a decision tree for approving a loan" | 示例："创建贷款审批决策树"

2. **Press Enter or click "Generate" | 按 Enter 或点击"生成"**

3. **Watch as the AI creates the diagram | 观看 AI 创建图表！**

### Editing Your Whiteboard | 编辑白板

- **Draw | 绘制**：Use Excalidraw's tools to draw, write, and create shapes | 使用 Excalidraw 工具绘制、书写和创建形状
- **Move | 移动**：Drag and drop elements to reposition them | 拖放元素以重新定位
- **Connect | 连接**：Draw arrows to connect elements | 绘制箭头连接元素
- **Style | 样式**：Change colors, fonts, and line styles | 更改颜色、字体和线条样式

### Saving & Exporting | 保存与导出

- **Save | 保存**：Click "Save" to download your whiteboard as a `.excalidraw` file | 点击"保存"下载白板为 `.excalidraw` 文件
- **Load | 加载**：Click "Load" to upload a previously saved whiteboard | 点击"加载"上传之前保存的白板
- **Export | 导出**：Click "Export PNG" to download as an image | 点击"导出 PNG"下载为图片
- **Clear | 清空**：Click "Clear" to start fresh | 点击"清空"重新开始

---

## 🏗️ Architecture | 架构

The application consists of several key components | 应用程序包含几个关键组件：

### Components | 组件

- **`ExcalidrawWrapper.tsx`**: Dynamic wrapper for Excalidraw (client-side only) | Excalidraw 的动态包装器（仅客户端）
- **`AIPromptInterface.tsx`**: UI for entering AI prompts | AI 提示输入界面
- **`Whiteboard.tsx`**: Main component integrating all features | 集成所有功能的主组件

### API Routes | API 路由

- **`/api/generate-shapes`**: AI API integration for shape generation | AI API 集成用于形状生成

### Utilities | 工具函数

- **`excalidrawUtils.ts`**: Converts AI responses to Excalidraw elements | 将 AI 响应转换为 Excalidraw 元素
- **`aiProvider.ts`**: AI provider abstraction layer supporting multiple providers | AI 提供商抽象层,支持多个 AI 服务

---

## 🤖 Supported AI Providers | 支持的 AI 提供商

This project supports multiple AI providers through a unified abstraction layer. You can switch between providers by setting the `AI_PROVIDER` environment variable.

本项目通过统一抽象层支持多个 AI 提供商。通过设置 `AI_PROVIDER` 环境变量即可切换。

| Provider | Model | Strengths | 优势 |
|----------|-------|-----------|------|
| **Google Gemini** ⭐ | `gemini-3-pro-preview` | Advanced multimodal, strong reasoning, wide capabilities | 高级多模态,推理能力强,功能广泛 |
| Moonshot (Kimi) | `kimi-k2-thinking` | Advanced reasoning, Chinese language support | 高级推理能力,中文支持好 |
| OpenAI | `gpt-4o` | Fast, reliable, widely available | 快速可靠,广泛可用 |
| Anthropic | `claude-3-5-sonnet` | Strong structured output, safety | 结构化输出强,安全性好 |
| DeepSeek | `deepseek-chat` | Cost-effective, good performance | 性价比高,性能好 |

### Switching Providers | 切换提供商

Simply change the `AI_PROVIDER` variable in your `.env` file and restart the dev server:

只需修改 `.env` 文件中的 `AI_PROVIDER` 变量并重启开发服务器：

```env
# Use Google Gemini
AI_PROVIDER=gemini
GEMINI_API_KEY=your-gemini-key
```

---

## 🔧 Configuration | 配置

### AI Model | AI 模型

You can customize the model for each provider using environment variables | 可以通过环境变量自定义每个提供商的模型：

```env
# Gemini models
GEMINI_MODEL=gemini-3-pro-preview # default

# Moonshot models | 月之暗面模型
MOONSHOT_MODEL=kimi-k2-thinking  # default | 默认

# OpenAI models
OPENAI_MODEL=gpt-4o  # or gpt-4-turbo, gpt-3.5-turbo

# Anthropic models
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022  # or claude-3-opus

# DeepSeek models
DEEPSEEK_MODEL=deepseek-chat
```

The provider abstraction is located in `src/lib/aiProvider.ts` | 提供商抽象层位于 `src/lib/aiProvider.ts`

### Styling | 样式

Tailwind CSS is pre-configured. Modify `tailwind.config.ts` to customize the design system | Tailwind CSS 已预配置。修改 `tailwind.config.ts` 以自定义设计系统。

---

## 🐳 Docker (Optional) | Docker（可选）

Build and run with Docker | 使用 Docker 构建和运行：

```bash
# Build the image | 构建镜像
docker build -t ai-whiteboard .

# Run the container | 运行容器
docker run -p 3000:3000 --env-file .env ai-whiteboard
```

---

## 📚 Tech Stack | 技术栈

- **Framework | 框架**: [Next.js 16](https://nextjs.org/) with App Router | 使用 App Router
- **UI Library | UI 库**: [Excalidraw](https://excalidraw.com/) - Infinite canvas whiteboard | 无限画布白板
- **Styling | 样式**: [Tailwind CSS](https://tailwindcss.com/)
- **AI SDK | AI 开发套件**: [Vercel AI SDK](https://sdk.vercel.ai/) with Google Gemini | 使用 Google Gemini
- **Language | 语言**: TypeScript

---

## 🎨 Examples | 示例

Try these prompts to see the AI in action | 尝试这些提示，体验 AI 功能：

### Flowcharts | 流程图
- "Create a flowchart for logging into an application" | "创建应用程序登录流程图"
- "Show the process for user registration and email verification" | "显示用户注册和邮件验证流程"

### System Architecture | 系统架构
- "Draw a 3-tier architecture with load balancer" | "绘制带有负载均衡器的三层架构"
- "Show microservices architecture with API gateway" | "显示带有 API 网关的微服务架构"

### Decision Trees | 决策树
- "Create a decision tree for customer support ticket routing" | "创建客户支持工单路由决策树"
- "Show approval workflow for expense reports" | "显示费用报告审批工作流"

### Mind Maps | 思维导图
- "Create a mind map for project planning phases" | "创建项目规划阶段思维导图"
- "Show feature prioritization matrix" | "显示功能优先级矩阵"

---

## 🤝 Contributing | 贡献

Feel free to submit issues, fork the repository, and create pull requests for any improvements! | 欢迎提交问题、Fork 仓库并创建 Pull Request 进行改进！

---

## 📄 License | 许可证

MIT

---

## 🙏 Acknowledgments | 致谢

- [Excalidraw](https://excalidraw.com/) for the amazing whiteboard library | 出色的白板库
- [Vercel AI SDK](https://sdk.vercel.ai/) for simplifying AI integration | 简化 AI 集成
- [Google Gemini](https://ai.google.dev/) for the powerful language models | Kimi K2 思维模型

---

**Happy Drawing! | 祝您绘制愉快！** 🚀✨

---

<a name="中文"></a>

## 中文文档

# 🎨 AI 白板编辑器

一个由 Next.js、Excalidraw 和 Google Gemini 驱动的智能白板编辑器。用自然语言描述您想绘制的内容，AI 将实时为您生成图表、流程图和形状！

### 核心特性

- 🤖 **AI 智能生成**：通过自然语言描述生成图表、流程图和形状
- 🎨 **完整的 Excalidraw 集成**：使用 Excalidraw 的所有强大功能
- 💾 **多种导出选项**：支持 PNG 和 Excalidraw 格式导出
- 📂 **加载与保存**：本地存储白板并随时加载
- 📱 **响应式界面**：使用 Tailwind CSS 的简洁现代界面
- ⚡ **实时编辑**：具有完整绘图功能的交互式白板
- 🔗 **自动箭头生成**：智能生成箭头连接形状，创建完美流程图

### 快速开始

1. **克隆项目并进入目录**
```bash
cd /Users/daoming/prog/test/kimi/app/whiteboard/ai-whiteboard
```

2. **配置环境变量**
```bash
cp .env.example .env
```
编辑 `.env` 文件，添加您的 Google Gemini API 密钥。

3. **运行项目**
```bash
npm run dev
```

4. **访问应用**
在浏览器中打开 [http://localhost:3000](http://localhost:3000)

### 使用示例

**生成流程图**：
- "创建一个咖啡制作流程图，包含研磨、冲泡、品尝的步骤"
- "绘制用户登录注册的系统流程"
- "创建项目管理的决策树"

**AI 会自动**：
- 生成合适的形状（矩形、菱形、椭圆）
- 添加文本标签和说明
- 创建箭头连接各步骤
- 使用不同颜色区分开始/结束节点

### 项目架构

- **前端**: Next.js 16 + React + TypeScript
- **白板引擎**: Excalidraw
- **AI 服务**: Google Gemini (gemini-3-pro-preview)
- **样式**: Tailwind CSS
- **状态管理**: React Hooks

### 技术亮点

- **智能布局**：AI 生成的形状自动排列成网格布局
- **自动连接**：智能生成垂直箭头连接流程步骤
- **标签系统**：内置文本标签系统，清晰展示每个元素
- **响应式设计**：适配桌面和移动设备
- **类型安全**：完整的 TypeScript 类型定义

### 开发指南

```bash
# 安装依赖
npm install

# 运行开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

### 许可证

MIT License - 查看 [LICENSE](LICENSE) 文件了解详情
