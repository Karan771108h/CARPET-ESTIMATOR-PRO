import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Renders a DOM element to a multi-page PDF with consistent page margins.
 * Elements with data-page-break="before" always start on a fresh page.
 * Elements with data-no-break="true" or page-break-inside: avoid are never sliced across page boundaries.
 */
export async function generatePDFFromDOM(elementId: string, filename: string): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) throw new Error(`Element with id '${elementId}' not found for PDF export.`);

  const parent = element.parentElement;
  if (parent && parent.classList.contains('hidden')) {
    parent.classList.remove('hidden');
    parent.style.position = 'absolute';
    parent.style.left = '-9999px';
    parent.style.top = '-9999px';
  }

  try {
    const elementRect = element.getBoundingClientRect();

    // Collect forced page breaks (data-page-break="before")
    const breakYsScreen: number[] = [];
    element.querySelectorAll<HTMLElement>('[data-page-break="before"]').forEach((el) => {
      breakYsScreen.push(el.getBoundingClientRect().top - elementRect.top);
    });

    // Collect atomic blocks that must NOT be cut in half across pages
    const atomicBlocksScreen: Array<{ top: number; bottom: number }> = [];
    element.querySelectorAll<HTMLElement>('[data-no-break="true"], [data-page-break-inside="avoid"]').forEach((el) => {
      const rect = el.getBoundingClientRect();
      atomicBlocksScreen.push({
        top: rect.top - elementRect.top,
        bottom: rect.bottom - elementRect.top,
      });
    });

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
      scrollY: 0,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      onclone: (clonedDoc) => {
        const clonedEl = clonedDoc.getElementById(elementId);
        if (clonedEl) {
          clonedEl.style.backgroundColor = '#ffffff';
          clonedEl.style.overflow = 'visible';
        }
      },
    });

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    // Page dimensions & margins
    const PAGE_W_MM  = 210;
    const PAGE_H_MM  = 297;
    const MARGIN_X   = 8;   // mm left & right
    const MARGIN_Y   = 10;  // mm top & bottom
    const CONTENT_W  = PAGE_W_MM - MARGIN_X * 2;  // 194 mm
    const CONTENT_H  = PAGE_H_MM - MARGIN_Y * 2;  // 277 mm

    // px-per-mm of content area (at scale:2, canvas.width = element.scrollWidth * 2)
    const pxPerMm    = canvas.width / CONTENT_W;
    const pageHPx    = CONTENT_H * pxPerMm;  // canvas px per content-height page

    // Convert screen-space positions to canvas px (scale = 2)
    const breakYsPx   = breakYsScreen.map((y) => y * 2);
    const atomicBlocks = atomicBlocksScreen.map((b) => ({
      top: b.top * 2,
      bottom: b.bottom * 2,
    }));

    // Build smart slice boundaries
    const cuts: number[] = [0];
    let cursor = 0;
    const pendingBreaks = [...breakYsPx];

    while (cursor + pageHPx < canvas.height) {
      const naturalCut = cursor + pageHPx;

      // 1. Check if there's a forced hard break before naturalCut
      const forcedIdx = pendingBreaks.findIndex((y) => y > cursor + 10 && y <= naturalCut);
      if (forcedIdx !== -1) {
        const forcedY = pendingBreaks.splice(forcedIdx, 1)[0];
        cuts.push(forcedY);
        cursor = forcedY;
        continue;
      }

      // 2. Check if naturalCut cuts through an atomic block
      const straddlingBlock = atomicBlocks.find(
        (block) => block.top > cursor + 10 && block.top < naturalCut && block.bottom > naturalCut
      );

      let cutY = naturalCut;
      if (straddlingBlock) {
        // Cut at top of the block so it starts cleanly on the next page
        cutY = straddlingBlock.top;
      }

      cuts.push(cutY);
      cursor = cutY;
    }
    cuts.push(canvas.height);

    // Render each slice as one PDF page
    for (let i = 0; i < cuts.length - 1; i++) {
      if (i > 0) pdf.addPage();

      const srcY = cuts[i];
      const srcH = cuts[i + 1] - cuts[i];
      if (srcH <= 0) continue;

      const sliceCanvas = document.createElement('canvas');
      sliceCanvas.width  = canvas.width;
      sliceCanvas.height = srcH;
      const ctx = sliceCanvas.getContext('2d')!;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
      ctx.drawImage(canvas, 0, srcY, canvas.width, srcH, 0, 0, canvas.width, srcH);

      const sliceData    = sliceCanvas.toDataURL('image/jpeg', 0.98);
      const sliceHMm     = srcH / pxPerMm;
      // Place with margins: content starts at (MARGIN_X, MARGIN_Y)
      pdf.addImage(sliceData, 'JPEG', MARGIN_X, MARGIN_Y, CONTENT_W, sliceHMm);
    }

    pdf.save(filename);
  } finally {
    if (parent && parent.style.position === 'absolute') {
      parent.classList.add('hidden');
      parent.style.position = '';
      parent.style.left = '';
      parent.style.top = '';
    }
  }
}
