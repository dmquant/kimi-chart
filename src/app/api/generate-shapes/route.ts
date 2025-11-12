import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { callAICompletion, getAIProviderConfig } from '@/lib/aiProvider';

// Define schemas for Excalidraw elements
const excalidrawElementSchema = z.object({
  type: z.enum(['rectangle', 'diamond', 'ellipse', 'arrow', 'text']),
  text: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
});

const responseSchema = z.object({
  elements: z.array(excalidrawElementSchema),
});

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Get AI provider configuration
    const providerConfig = getAIProviderConfig();
    console.log(`Using AI provider: ${providerConfig.name} (${providerConfig.model})`);

    // Call AI API with provider abstraction
    const aiResponse = await callAICompletion([
      {
        role: 'system',
        content: 'You are a helpful assistant that generates structured data for Excalidraw diagrams. Always respond with a JSON object containing an array of elements with type, text, width, and height properties.'
      },
      {
        role: 'user',
        content: `Generate Excalidraw elements based on this user request: "${prompt}"

Return an array of elements with their types and properties. For flowcharts and diagrams:
- Use rectangles for processes/steps
- Use diamonds for decisions
- Use ellipses for start/end
- Use arrows to connect elements (specify start and end)
- Use text for labels

Example for "user login flow":
{
  "elements": [
    { "type": "ellipse", "text": "Start" },
    { "type": "rectangle", "text": "Enter credentials", "width": 150, "height": 80 },
    { "type": "diamond", "text": "Valid?", "width": 120, "height": 120 },
    { "type": "rectangle", "text": "Login success", "width": 150, "height": 80 },
    { "type": "rectangle", "text": "Show error", "width": 150, "height": 80 },
    { "type": "ellipse", "text": "End" }
  ]
}`
      }
    ], 0.3);

    console.log(`${providerConfig.name} Raw Response:`, aiResponse); // DEBUG

    // Parse the JSON response from the AI
    // The AI might wrap it in markdown code blocks, so try to extract it
    let jsonStr = aiResponse;
    const codeBlockMatch = aiResponse.match(/```(?:json)?\n?([\s\S]*?)```/);
    if (codeBlockMatch) {
      jsonStr = codeBlockMatch[1];
    }

    console.log('Extracted JSON string:', jsonStr); // DEBUG

    let parsed;
    try {
      parsed = JSON.parse(jsonStr);
      console.log('Parsed JSON:', parsed); // DEBUG
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      return NextResponse.json(
        { error: 'Invalid JSON response from AI', details: jsonStr },
        { status: 500 }
      );
    }

    let validated;
    try {
      validated = responseSchema.parse(parsed);
      console.log('Validated schema:', validated); // DEBUG
    } catch (validateError) {
      console.error('Schema Validation Error:', validateError);
      return NextResponse.json(
        { error: 'Response does not match expected schema', details: parsed },
        { status: 500 }
      );
    }

    return NextResponse.json({ elements: validated.elements });
  } catch (error) {
    console.error('AI generation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate shapes';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
