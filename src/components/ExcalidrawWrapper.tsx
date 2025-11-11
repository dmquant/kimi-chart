// Client component wrapper for Excalidraw
'use client';

import dynamic from 'next/dynamic';
import '@excalidraw/excalidraw/index.css';

const Excalidraw = dynamic(
  async () => (await import('@excalidraw/excalidraw')).Excalidraw,
  { ssr: false }
);

export { Excalidraw };
