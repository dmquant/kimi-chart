# GEMINI.md

## Project Overview

**AI Whiteboard Editor** is a Next.js application that integrates Excalidraw with Generative AI (primarily Google Gemini) to allow users to create diagrams, flowcharts, and shapes using natural language descriptions. It serves as an intelligent assistant for visual thinking and architectural design.

## Technical Stack

*   **Framework:** Next.js 16 (App Router)
*   **Language:** TypeScript
*   **UI/Styling:** Tailwind CSS v4
*   **Whiteboard Engine:** Excalidraw (`@excalidraw/excalidraw`)
*   **AI Integration:** Custom abstraction layer supporting Google Gemini (default), Moonshot (Kimi), OpenAI, Anthropic, and DeepSeek.
*   **Validation:** Zod
*   **Package Manager:** npm (implied by `package.json` scripts)

## Architecture & Data Flow

The application follows a standard Next.js App Router architecture with a clear separation between client-side UI and server-side AI processing.

### Data Flow
1.  **User Input:** The user enters a prompt in `AIPromptInterface.tsx`.
2.  **API Request:** A POST request is sent to `/api/generate-shapes`.
3.  **AI Processing:** The server-side route (`route.ts`) uses the configured AI provider (via `src/lib/aiProvider.ts`) to interpret the prompt.
4.  **Structured Response:** The AI returns a JSON response containing a list of shapes (rectangles, diamonds, ellipses) and their properties.
5.  **Conversion:** `excalidrawUtils.ts` converts these abstract shape definitions into Excalidraw-compatible elements, applying styles and automatic layout (grid system).
6.  **Rendering:** `Whiteboard.tsx` updates the Excalidraw scene with the new elements.

### Key Components

*   **`src/components/Whiteboard.tsx`**: The main container component. It manages the Excalidraw instance, handles save/load/export functionality, and orchestrates the update of the canvas.
*   **`src/components/AIPromptInterface.tsx`**: The UI component where users input their natural language prompts.
*   **`src/components/ExcalidrawWrapper.tsx`**: A wrapper component that handles the dynamic import of Excalidraw to ensure it only runs on the client side (since it relies on the `window` object).
*   **`src/app/api/generate-shapes/route.ts`**: The server-side API route that interfaces with the AI providers. It includes prompt engineering (system messages) to guide the AI to produce valid JSON matching the expected schema.
*   **`src/lib/aiProvider.ts`**: An abstraction layer that creates a unified interface for different AI providers (Moonshot, OpenAI, Anthropic, DeepSeek), handling their specific API nuances.
*   **`src/lib/excalidrawUtils.ts`**: Contains logic for converting the AI's JSON output into specific Excalidraw element objects (ids, positions, styles, colors). It also implements logic for auto-connecting shapes with arrows if the AI doesn't provide them.

## Development Workflow

### Prerequisites
*   Node.js 18+
*   An API key for one of the supported AI providers (Google Gemini is recommended).

### Key Commands

*   **Install Dependencies:** `npm install`
*   **Start Development Server:** `npm run dev` (Runs on `http://localhost:3000`)
*   **Build for Production:** `npm run build`
*   **Start Production Server:** `npm run start`
*   **Lint Code:** `npm run lint`

### Environment Configuration (`.env`)

The application relies on environment variables to configure the AI provider. Create a `.env` file in the root directory:

```env
# AI Provider Selection (gemini, moonshot, openai, anthropic, deepseek)
AI_PROVIDER=gemini

# API Keys (Set the one corresponding to your chosen provider)
GEMINI_API_KEY=your_key
MOONSHOT_API_KEY=your_key
OPENAI_API_KEY=your_key
ANTHROPIC_API_KEY=your_key
DEEPSEEK_API_KEY=your_key

# Model Selection (Optional overrides)
# GEMINI_MODEL=gemini-3-pro-preview
# MOONSHOT_MODEL=kimi-k2-thinking
# OPENAI_MODEL=gpt-4o
```

## Development Conventions

*   **Client vs. Server Components:** Excalidraw is strictly client-side. Components using it must use the `'use client'` directive or be dynamically imported.
*   **Type Safety:** The project uses TypeScript Strict Mode. All external data (especially from AI) is validated using Zod schemas before use.
*   **Styling:** Tailwind CSS is used for all custom UI elements outside the Excalidraw canvas.
*   **Path Aliases:** `@/*` maps to `./src/*`.
