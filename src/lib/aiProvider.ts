// AI Provider abstraction layer
// Supports multiple AI providers while keeping Kimi (Moonshot) as the default

interface AIProviderConfig {
  name: string;
  model: string;
  baseURL?: string;
  apiKey: string;
}

interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface AICompletionRequest {
  model: string;
  messages: AIMessage[];
  temperature?: number;
}

interface AICompletionResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

/**
 * Get AI provider configuration based on environment variables
 * Defaults to Gemini if AI_PROVIDER is not set
 */
export function getAIProviderConfig(): AIProviderConfig {
  const provider = process.env.AI_PROVIDER?.toLowerCase() || 'gemini';

  switch (provider) {
    case 'openai':
      return {
        name: 'OpenAI',
        model: process.env.OPENAI_MODEL || 'gpt-4o',
        baseURL: 'https://api.openai.com/v1',
        apiKey: process.env.OPENAI_API_KEY || '',
      };

    case 'anthropic':
      return {
        name: 'Anthropic',
        model: process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022',
        baseURL: 'https://api.anthropic.com/v1',
        apiKey: process.env.ANTHROPIC_API_KEY || '',
      };

    case 'deepseek':
      return {
        name: 'DeepSeek',
        model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
        baseURL: 'https://api.deepseek.com/v1',
        apiKey: process.env.DEEPSEEK_API_KEY || '',
      };

    case 'moonshot':
      return {
        name: 'Kimi (Moonshot)',
        model: process.env.MOONSHOT_MODEL || 'kimi-k2-thinking',
        baseURL: 'https://api.moonshot.cn/v1',
        apiKey: process.env.MOONSHOT_API_KEY || '',
      };

    case 'gemini':
    default:
      return {
        name: 'Google Gemini',
        model: process.env.GEMINI_MODEL || 'gemini-3-pro-preview',
        baseURL: 'https://generativelanguage.googleapis.com/v1beta',
        apiKey: process.env.GEMINI_API_KEY || '',
      };
  }
}

/**
 * Call AI provider's chat completion API
 * Uses OpenAI-compatible format which most providers support
 */
export async function callAICompletion(
  messages: AIMessage[],
  temperature: number = 0.3
): Promise<string> {
  const config = getAIProviderConfig();

  if (!config.apiKey) {
    throw new Error(
      `${config.name} API key not configured. Please set the appropriate environment variable.`
    );
  }

  // Special handling for Anthropic (different API format)
  if (process.env.AI_PROVIDER?.toLowerCase() === 'anthropic') {
    return callAnthropicAPI(config, messages, temperature);
  }

  // Special handling for Gemini (different API format)
  if (process.env.AI_PROVIDER?.toLowerCase() === 'gemini' || !process.env.AI_PROVIDER) {
    return callGeminiAPI(config, messages, temperature);
  }

  // OpenAI-compatible API call (works for OpenAI, Moonshot, DeepSeek, etc.)
  const requestBody: AICompletionRequest = {
    model: config.model,
    messages,
    temperature,
  };

  const response = await fetch(`${config.baseURL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `${config.name} API error: ${response.status} ${response.statusText}\n${errorText}`
    );
  }

  const data: AICompletionResponse = await response.json();
  const content = data.choices[0]?.message?.content;

  if (!content) {
    throw new Error(`No response from ${config.name} API`);
  }

  return content;
}

/**
 * Special handler for Anthropic API (different format)
 */
async function callAnthropicAPI(
  config: AIProviderConfig,
  messages: AIMessage[],
  temperature: number
): Promise<string> {
  // Anthropic requires system message separately
  const systemMessage = messages.find(m => m.role === 'system');
  const userMessages = messages.filter(m => m.role !== 'system');

  const requestBody = {
    model: config.model,
    max_tokens: 4096,
    temperature,
    system: systemMessage?.content || '',
    messages: userMessages.map(m => ({
      role: m.role,
      content: m.content,
    })),
  };

  const response = await fetch(`${config.baseURL}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': config.apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `${config.name} API error: ${response.status} ${response.statusText}\n${errorText}`
    );
  }

  const data = await response.json() as { content?: Array<{ text: string }> };
  const content = data.content?.[0]?.text;

  if (!content) {
    throw new Error(`No response from ${config.name} API`);
  }

  return content;
}

/**
 * Special handler for Google Gemini API
 */
async function callGeminiAPI(
  config: AIProviderConfig,
  messages: AIMessage[],
  temperature: number
): Promise<string> {
  const systemMessage = messages.find(m => m.role === 'system');
  const conversationMessages = messages.filter(m => m.role !== 'system');

  const requestBody: any = {
    contents: conversationMessages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    })),
    generationConfig: {
      temperature: temperature,
    }
  };

  if (systemMessage) {
    requestBody.systemInstruction = {
      parts: [{ text: systemMessage.content }]
    };
  }

  const response = await fetch(`${config.baseURL}/models/${config.model}:generateContent?key=${config.apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `${config.name} API error: ${response.status} ${response.statusText}\n${errorText}`
    );
  }

  const data = await response.json();
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!content) {
    throw new Error(`No response from ${config.name} API`);
  }

  return content;
}
