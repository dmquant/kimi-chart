// Main Whiteboard component integrating Excalidraw and AI
'use client';

import { useState, useRef, useCallback } from 'react';
import { Excalidraw } from './ExcalidrawWrapper';
import AIPromptInterface from './AIPromptInterface';
import { convertAIElementsToExcalidraw } from '@/lib/excalidrawUtils';

export default function Whiteboard() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleAIGeneratedShapes = useCallback(async (aiElements: any[]) => {
    if (!excalidrawAPI) {
      console.error('Excalidraw API not available');
      return;
    }

    console.log('Whiteboard: Received AI elements:', aiElements); // DEBUG

    const excalidrawElements = await convertAIElementsToExcalidraw(aiElements);
    console.log('Whiteboard: Converted to Excalidraw elements:', excalidrawElements); // DEBUG

    const currentElements = excalidrawAPI.getSceneElements();
    console.log('Whiteboard: Current elements count:', currentElements.length); // DEBUG

    // Add new elements to the scene
    const newElements = [...currentElements, ...excalidrawElements];
    console.log('Whiteboard: Updating scene with', newElements.length, 'elements'); // DEBUG

    // Ensure proper rendering by including app state
    excalidrawAPI.updateScene({
      elements: newElements,
      appState: {
        ...(excalidrawAPI.getAppState() || {}),
        viewBackgroundColor: '#ffffff',
      },
      // Trigger a commit to ensure elements are rendered
      commitToHistory: true,
    });

    console.log('Whiteboard: Scene updated'); // DEBUG
  }, [excalidrawAPI]);

  const handleExport = useCallback(() => {
    if (!excalidrawAPI) return;

    // Export as PNG
    const canvas = document.querySelector(
      '.excalidraw-container canvas'
    ) as HTMLCanvasElement;

    if (canvas) {
      const link = document.createElement('a');
      link.download = `whiteboard-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  }, [excalidrawAPI]);

  const handleClear = useCallback(() => {
    if (!excalidrawAPI) return;

    excalidrawAPI.updateScene({
      elements: [],
    });
  }, [excalidrawAPI]);

  const handleSaveToFile = useCallback(() => {
    if (!excalidrawAPI) return;

    const elements = excalidrawAPI.getSceneElements();
    const data = {
      type: 'excalidraw',
      version: 2,
      source: 'https://ai-whiteboard-editor.com',
      elements: elements,
      appState: {
        viewBackgroundColor: '#ffffff',
      },
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `whiteboard-${Date.now()}.excalidraw`;
    link.click();
    URL.revokeObjectURL(url);
  }, [excalidrawAPI]);

  const handleLoadFromFile = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file || !excalidrawAPI) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const data = JSON.parse(content);

          if (data.type === 'excalidraw' && data.elements) {
            excalidrawAPI.updateScene({
              elements: data.elements,
            });
          }
        } catch (error) {
          alert('Error loading file. Please select a valid .excalidraw file.');
          console.error('Error loading file:', error);
        }
      };
      reader.readAsText(file);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [excalidrawAPI]
  );

  return (
    <div className="h-screen flex flex-col">
      {/* Header with title and action buttons */}
      <header className="bg-gray-900 text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">🎨 AI Whiteboard Editor</h1>
        <div className="flex gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition-colors"
          >
            Load
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".excalidraw,.json"
            onChange={handleLoadFromFile}
            className="hidden"
          />
          <button
            onClick={handleSaveToFile}
            className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 transition-colors"
          >
            Save
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-700 transition-colors"
          >
            Export PNG
          </button>
          <button
            onClick={handleClear}
            className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition-colors"
          >
            Clear
          </button>
        </div>
      </header>

      {/* AI Prompt Interface */}
      <AIPromptInterface
        onShapesGenerated={handleAIGeneratedShapes}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />

      {/* Excalidraw Canvas */}
      <div className="flex-1 relative">
        {/* @ts-expect-error Excalidraw API type is not exported */}
        <Excalidraw excalidrawAPI={(api) => setExcalidrawAPI(api)}
          theme="light"
          name="AI Whiteboard"
          viewModeEnabled={false}
          zenModeEnabled={false}
          gridModeEnabled={false}
          libraryReturnUrl={undefined}
          UIOptions={{
            canvasActions: {
              saveToActiveFile: false,
              loadScene: false,
            },
          }}
        />
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-800">AI is generating your diagram...</span>
          </div>
        </div>
      )}
    </div>
  );
}
