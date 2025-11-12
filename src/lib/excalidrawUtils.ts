// Utility functions for creating Excalidraw elements
// Note: @excalidraw/excalidraw uses window, so we dynamically import it on the client side

interface AIElement {
  type: string;
  text?: string;
  width?: number;
  height?: number;
  x: number;
  y: number;
  id: string;
  startIndex?: number;
  endIndex?: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function convertAIElementsToExcalidraw(aiElements: AIElement[]): Promise<any[]> {
  try {
    // Dynamically import convertToExcalidrawElements on client side only
    const { convertToExcalidrawElements } = await import("@excalidraw/excalidraw");

    // Separate shapes from arrows and filter out invalid elements
    const shapes = aiElements.filter(el => el.type !== 'arrow' && el.type !== 'text');
    const arrows = aiElements.filter(el => el.type === 'arrow');
    const textElements = aiElements.filter(el => el.type === 'text' && el.text && el.text.trim() !== '');

    console.log(`Found ${shapes.length} shapes, ${arrows.length} arrows, ${textElements.length} valid text elements`);

    // AUTO-GENERATE ARROWS if none provided by AI
    // Create arrows to connect shapes vertically in columns
    if (arrows.length === 0 && shapes.length > 0) {
      console.log('No arrows provided by AI, auto-generating arrows between shapes');

      // For each shape (except last row), create arrows to connect to next row
      for (let i = 0; i < shapes.length - 3; i++) {
        const fromShape = shapes[i];

        // Create arrow positioned between the two shapes
        arrows.push({
          type: 'arrow',
          x: fromShape.x + (fromShape.width || 150) / 2, // Center horizontally on shape
          y: fromShape.y + (fromShape.height || 80), // Start at bottom of shape
          width: 0,
          height: 150, // Arrow length to reach next row
          id: `arrow_auto_${i}`,
          text: '', // No label for automatic arrows
        } as AIElement);
      }

      console.log(`Auto-generated ${arrows.length} arrows`);
    }

    // Convert shapes first
    const shapeElements = shapes.map((element, index) => {
      const defaultWidth = element.width || 150;
      const defaultHeight = element.height || 80;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const shapeEl: any = {
        type: element.type,
        x: element.x,
        y: element.y,
        width: defaultWidth,
        height: defaultHeight,
        strokeWidth: 2,
        roughness: 1,
        seed: Math.floor(Math.random() * 100000),
        id: `shape_${Date.now()}_${index}`,
      };

      // Set specific properties based on type
      switch (element.type) {
        case "rectangle":
          shapeEl.backgroundColor = "#dbeafe";
          shapeEl.strokeColor = "#2563eb";
          break;
        case "diamond":
          shapeEl.backgroundColor = "#fef3c7";
          shapeEl.strokeColor = "#f59e0b";
          break;
        case "ellipse":
          shapeEl.backgroundColor = element.text?.toLowerCase().includes("start") || element.text?.toLowerCase().includes("end")
            ? "#dcfce7"
            : "#e0e7ff";
          shapeEl.strokeColor = element.text?.toLowerCase().includes("start") || element.text?.toLowerCase().includes("end")
            ? "#16a34a"
            : "#7c3aed";
          break;
      }

      // Add label if text is provided
      if (element.text) {
        shapeEl.label = {
          text: element.text,
          strokeColor: element.text?.toLowerCase().includes("start") || element.text?.toLowerCase().includes("end")
            ? "#16a34a"
            : element.type === "diamond" ? "#111827" : "#111827",
          fontSize: element.type === "diamond" || element.type === "ellipse" ? 18 : 18,
          textAlign: "center",
          verticalAlign: "middle",
        };
      }

      console.log(`Created ${element.type}:`, shapeEl); // DEBUG
      return shapeEl;
    });

    // Create arrows with proper binding to shapes
    const arrowElements = arrows.map((element, index) => {
      const arrowId = `arrow_${Date.now()}_${index}`;

      const arrowHeight = element.height || 100;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const arrowEl: any = {
        type: "arrow",
        x: element.x,
        y: element.y,
        width: 0,
        height: arrowHeight,
        points: [
          [0, 0],
          [0, arrowHeight]
        ],
        strokeColor: element.text ? "#10b981" : "#6b7280",
        strokeWidth: 2,
        strokeStyle: "solid",
        roughness: 1,
        seed: Math.floor(Math.random() * 100000),
        startArrowhead: null,
        endArrowhead: "arrow",
        id: arrowId,
      };

      // Add label if provided
      if (element.text) {
        arrowEl.label = {
          text: element.text,
          strokeColor: "#10b981",
          fontSize: 16,
          textAlign: "center",
          verticalAlign: "middle",
        };
      }

      console.log('Created arrow:', arrowEl); // DEBUG
      return arrowEl;
    });

    // Convert standalone text elements
    const standaloneTextElements = textElements.map((element, index) => {
      const textId = `text_${Date.now()}_${index}`;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const textEl: any = {
        type: "text",
        x: element.x,
        y: element.y,
        text: element.text || "Text",
        fontSize: 16,
        fontFamily: 1,
        textAlign: "center",
        verticalAlign: "middle",
        strokeColor: "#111827",
        backgroundColor: "transparent",
        fillStyle: "solid",
        strokeWidth: 1,
        strokeStyle: "solid",
        roughness: 1,
        opacity: 100,
        seed: Math.floor(Math.random() * 100000),
        id: textId,
      };

      console.log('Created standalone text:', textEl); // DEBUG
      return textEl;
    });

    const allElements = [...shapeElements, ...arrowElements, ...standaloneTextElements];

    console.log('All elements before conversion:', allElements); // DEBUG

    // Use Excalidraw's official conversion function
    const excalidrawElements = convertToExcalidrawElements(allElements);

    console.log('Elements after convertToExcalidrawElements:', excalidrawElements); // DEBUG

    return excalidrawElements;
  } catch (error) {
    console.error('Error converting elements:', error);
    return [];
  }
}

