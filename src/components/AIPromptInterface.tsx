// Client component for AI whiteboard generation
'use client';

import { useState } from 'react';

type AIPromptProps = {
  onShapesGenerated: (elements: any[]) => Promise<void> | void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
};

export default function AIPromptInterface({ onShapesGenerated, isLoading, setIsLoading }: AIPromptProps) {
  const [prompt, setPrompt] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    try {
      // Call AI API endpoint
      const response = await fetch('/api/generate-shapes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      console.log('AI API Response:', data); // DEBUG

      if (data.elements && Array.isArray(data.elements)) {
        console.log('Got elements:', data.elements.length, data.elements); // DEBUG

        // Separate shapes from arrows
        const shapes = data.elements.filter((el: any) => el.type !== 'arrow');
        const arrows = data.elements.filter((el: any) => el.type === 'arrow');

        // Position shapes in a grid
        const positionedShapes = shapes.map((element: any, index: number) => {
          const positioned = {
            ...element,
            x: 300 + (index % 3) * 250,
            y: 200 + Math.floor(index / 3) * 300,
            id: `${element.type}_${Date.now()}_${index}`,
          };
          console.log('Positioned shape:', positioned); // DEBUG
          return positioned;
        });

        // Position arrows between shapes to connect rows
        const positionedArrows = arrows.map((element: any, index: number) => {
          // Calculate which row this arrow belongs to (connecting from row to row+1)
          const row = Math.floor(index / 3);
          const col = index % 3;

          // Position arrows centered horizontally on the shape, and vertically between rows
          // Each shape is 80px tall, arrows are 100px tall, rows are 300px apart
          const positioned = {
            ...element,
            // Center arrow horizontally on the shape (shape width is ~150-180, so x + width/2)
            x: 300 + col * 250 + 75, // 75 is half of typical shape width
            // Position arrow starting from bottom of shape row to top of next row
            y: 200 + row * 300 + 80, // 80 is shape height
            id: `${element.type}_${Date.now()}_${index}`,
          };
          console.log('Positioned arrow:', positioned); // DEBUG
          return positioned;
        });

        const allPositionedElements = [...positionedShapes, ...positionedArrows];

        console.log('Calling onShapesGenerated with:', allPositionedElements); // DEBUG
        await onShapesGenerated(allPositionedElements);
      } else {
        console.error('No elements in response or elements is not an array:', data);
        alert('AI did not return valid elements. Please try again.');
      }
    } catch (error) {
      console.error('Error generating shapes:', error);
      alert('Error generating shapes. Please try again.');
    } finally {
      setIsLoading(false);
      setPrompt('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <div className="p-4 border-b border-gray-200 bg-white">
      <div className="flex gap-3">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Describe what you want to draw (e.g., 'Create a flowchart for user registration with 3 steps')..."
          className="flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={2}
          disabled={isLoading}
        />
        <button
          onClick={handleGenerate}
          disabled={isLoading || !prompt.trim()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Generating...' : 'Generate'}
        </button>
      </div>
      <p className="mt-2 text-sm text-gray-500">
        Press Enter to generate or Shift+Enter for new line
      </p>
    </div>
  );
}
