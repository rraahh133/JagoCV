import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

/**
 * Fetches Google Fonts CSS to avoid CORS issues.
 * This allows html-to-image to embed fonts properly.
 */
async function getGoogleFontsCSS(): Promise<string> {
  try {
    // Find all Google Fonts link tags
    const fontLinks = Array.from(document.querySelectorAll('link[href*="fonts.googleapis.com"]'));
    
    if (fontLinks.length === 0) {
      return '';
    }
    
    // Fetch CSS from all Google Fonts links
    const cssPromises = fontLinks.map(async (link) => {
      const href = (link as HTMLLinkElement).href;
      try {
        const response = await fetch(href);
        return await response.text();
      } catch (e) {
        console.warn('Could not fetch font CSS:', href);
        return '';
      }
    });
    
    const cssArray = await Promise.all(cssPromises);
    return cssArray.join('\n');
  } catch (e) {
    console.warn('Error fetching Google Fonts CSS:', e);
    return '';
  }
}

/**
 * Exports a DOM element to a PNG image using html-to-image.
 * @param elementId The ID of the element to export.
 * @param fileName The name of the file to save.
 */
export const exportToPng = async (elementId: string, fileName: string = 'document') => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with ID ${elementId} not found`);
    alert(`Error: Element ${elementId} not found`);
    return;
  }

  try {
    // Fetch Google Fonts CSS to avoid CORS errors
    const fontCSS = await getGoogleFontsCSS();
    
    // A4 height in pixels at 96 DPI
    const A4_HEIGHT_PX = 1123;
    const actualHeight = element.scrollHeight;
    const actualWidth = element.offsetWidth;
    const pageCount = Math.ceil(actualHeight / A4_HEIGHT_PX);
    
    console.log(`Exporting PNG: ${actualWidth}x${actualHeight}px (${pageCount} pages)`);
    
    // Use html-to-image to convert element to PNG with full height
    const dataUrl = await toPng(element, {
      quality: 1,
      pixelRatio: 2,
      backgroundColor: '#ffffff',
      fontEmbedCSS: fontCSS,
      width: actualWidth,
      height: actualHeight,
      filter: (node: any) => {
        if (node.classList && node.classList.contains('visual-page-break')) {
          return false;
        }
        return true;
      }
    });

    if (pageCount <= 1) {
      // Convert data URL to blob and download
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `${fileName}.png`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    } else {
      // Load the captured full-height image
      const img = new Image();
      img.src = dataUrl;
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      // Slice the image into separate pages and trigger downloads
      for (let i = 0; i < pageCount; i++) {
        const canvas = document.createElement('canvas');
        canvas.width = actualWidth * 2;        // pixelRatio = 2
        canvas.height = A4_HEIGHT_PX * 2;      // Always full A4 height
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Fill entire canvas with white (so short last pages still look like full A4)
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Calculate how many source pixels are available for this page
          const sourceY = i * A4_HEIGHT_PX * 2;
          const sourceHeight = Math.min(A4_HEIGHT_PX * 2, img.height - sourceY);

          if (sourceHeight > 0) {
            ctx.drawImage(
              img,
              0, sourceY,                        // Source position
              actualWidth * 2, sourceHeight,      // Source rectangle
              0, 0,                               // Destination position
              actualWidth * 2, sourceHeight        // Destination rectangle (same size)
            );
          }

          const pageDataUrl = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.download = `${fileName}_Halaman_${i + 1}.png`;
          link.href = pageDataUrl;
          link.click();
        }
      }
    }

  } catch (error) {
    console.error('Error exporting to PNG:', error);
    alert('Failed to export PNG. Check console for details.');
  }
};


/**
 * Exports a DOM element to a PDF using html-to-image + jsPDF.
 * Supports multi-page documents by detecting content height and splitting into pages.
 * @param elementId The ID of the element to export.
 * @param fileName The name of the file to save.
 */
export const exportToPdf = async (elementId: string, fileName: string = 'document') => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with ID ${elementId} not found`);
    alert(`Error: Element ${elementId} not found`);
    return;
  }

  try {
    // Fetch Google Fonts CSS to avoid CORS errors
    const fontCSS = await getGoogleFontsCSS();
    
    // A4 dimensions in pixels at 96 DPI (standard web DPI)
    const A4_WIDTH_PX = 794;  // 210mm at 96 DPI
    const A4_HEIGHT_PX = 1123; // 297mm at 96 DPI
    
    // Get actual content dimensions
    const contentHeight = element.scrollHeight;
    const contentWidth = element.offsetWidth;
    
    // Calculate number of pages needed
    const pageCount = Math.ceil(contentHeight / A4_HEIGHT_PX);
    
    console.log(`Exporting PDF: ${contentWidth}x${contentHeight}px (${pageCount} pages)`);
    
    // Create PDF with A4 dimensions
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = 210; // A4 width in mm
    const pdfHeight = 297; // A4 height in mm
    
    // If content fits in one page, use simple export
    if (pageCount === 1) {
      const dataUrl = await toPng(element, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        fontEmbedCSS: fontCSS,
        filter: (node: any) => {
          if (node.classList && node.classList.contains('visual-page-break')) {
            return false;
          }
          return true;
        }
      });
      
      const imgHeight = (contentHeight * pdfWidth) / contentWidth;
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, imgHeight);
    } else {
      // Multi-page export: capture full content then split
      const dataUrl = await toPng(element, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        fontEmbedCSS: fontCSS,
        width: contentWidth,
        height: contentHeight,
        filter: (node: any) => {
          if (node.classList && node.classList.contains('visual-page-break')) {
            return false;
          }
          return true;
        }
      });
      
      // Calculate scaling factor
      const scale = pdfWidth / (contentWidth / 3.7795275591); // Convert px to mm
      
      // Add each page
      for (let i = 0; i < pageCount; i++) {
        if (i > 0) {
          pdf.addPage();
        }
        
        // Calculate the Y offset for this page in mm
        const yOffset = -(i * pdfHeight);
        const imgHeight = (contentHeight * pdfWidth) / contentWidth;
        
        // Add the image with offset to show the correct page section
        pdf.addImage(dataUrl, 'PNG', 0, yOffset, pdfWidth, imgHeight);
      }
    }
    
    pdf.save(`${fileName}.pdf`);

  } catch (error) {
    console.error('Error exporting to PDF:', error);
    alert('Failed to export PDF. Check console for details.');
  }
};


/**
 * Per-template CSS: custom variables, fonts, and utility classes.
 * These are embedded verbatim in the standalone HTML.
 */
const TEMPLATE_CSS: Record<string, { fonts: string[]; css: string }> = {
  BentoGelap: {
    fonts: [
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap',
    ],
    css: `
      :root {
        --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
        --font-display: "Space Grotesk", "Inter", ui-sans-serif, system-ui, sans-serif;
        --color-indigo-bg: #0A0C18;
        --color-indigo-card: #161B30;
        --color-indigo-card-hover: #1F2544;
        --color-electric-blue: #3b82f6;
        --color-electric-blue-dark: #2563eb;
        --color-warm-white: #F8FAFC;
        --color-muted-text: #94a3b8;
      }
      body { 
        background-color: #0A0C18; 
        color: #F8FAFC; 
        -webkit-font-smoothing: antialiased; 
        font-family: "Inter", ui-sans-serif, system-ui, sans-serif; 
      }
      .custom-scrollbar::-webkit-scrollbar { width: 6px; }
      .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); border-radius: 10px; }
      .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(59,130,246,0.5); border-radius: 10px; }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(59,130,246,0.7); }
    `,
  },
  DeveloperTerminal: {
    fonts: [],
    css: `
      body { 
        margin: 0; 
        background-color: #0A0C10; 
        color: #cbd5e1; 
        font-family: ui-sans-serif, system-ui, sans-serif; 
      }
    `,
  },
  CyberpunkNeon: {
    fonts: [
      'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap',
    ],
    css: `
      :root {
        --font-sans: "Space Grotesk", ui-sans-serif, system-ui, sans-serif;
        --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;
      }
      body { 
        background-color: #050507; 
        color: #e0e0e0; 
        font-family: "Space Grotesk", ui-sans-serif, system-ui, sans-serif; 
        -webkit-font-smoothing: antialiased; 
        overflow-x: hidden; 
      }
      .neon-text-cyan { 
        color: #00f3ff; 
        text-shadow: 0 0 8px rgba(0,243,255,0.8), 0 0 12px rgba(0,243,255,0.4); 
      }
      .neon-text-magenta { 
        color: #ff00ff; 
        text-shadow: 0 0 8px rgba(255,0,255,0.8), 0 0 12px rgba(255,0,255,0.4); 
      }
    `,
  },
  MinimalisElegan: {
    fonts: [
      'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Inter:wght@300;400;500;600&display=swap',
    ],
    css: `
      :root {
        --font-serif: "Playfair Display", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
        --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
        --color-obsidian: #050505;
        --color-cyan-glow: #22d3ee;
      }
      body { 
        background-color: #050505; 
        color: #fff; 
        font-family: "Inter", ui-sans-serif, system-ui, sans-serif; 
      }
    `,
  },
  NeoBrutalis: {
    fonts: [
      'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
    ],
    css: `
      :root {
        --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
        --color-neo-bg: #1a1c1e;
        --color-neo-text: #cbd5e1;
        --color-neo-text-dim: #94a3b8;
        --color-neo-accent: #3b82f6;
        --color-neo-border: #25282c;
      }
      body { 
        background-color: #1a1c1e; 
        color: #cbd5e1; 
        font-family: "Inter", ui-sans-serif, system-ui, sans-serif; 
      }
      .bg-neo { background-color: var(--color-neo-bg); }
      .neo-raised, .neo-flat { 
        background: #1a1c1e; 
        box-shadow: 8px 8px 16px #121315, -8px -8px 16px #222527; 
      }
      .neo-flat-sm { 
        background: #1a1c1e; 
        box-shadow: 5px 5px 10px #121315, -5px -5px 10px #222527; 
      }
      .neo-circle { 
        background: #1a1c1e; 
        box-shadow: 6px 6px 12px #121315, -6px -6px 12px #222527; 
      }
      .neo-pressed, .neo-inset { 
        background: #1a1c1e; 
        box-shadow: inset 6px 6px 12px #121315, inset -6px -6px 12px #222527; 
      }
      .neo-pressed-small, .neo-inset-sm { 
        background: #1a1c1e; 
        box-shadow: inset 3px 3px 6px #121315, inset -3px -3px 6px #222527; 
      }
      .neo-button { 
        background: #1a1c1e; 
        box-shadow: 5px 5px 10px #121315, -5px -5px 10px #222527; 
        transition: all 0.2s ease-in-out; 
      }
      .neo-button:hover { 
        box-shadow: 3px 3px 6px #121315, -3px -3px 6px #222527; 
        transform: translateY(2px); 
      }
      .neo-button:active { 
        box-shadow: inset 3px 3px 6px #121315, inset -3px -3px 6px #222527; 
        transform: translateY(4px); 
      }
      .neo-interactive { transition: all 0.2s ease-in-out; }
      .neo-interactive:hover { 
        box-shadow: 3px 3px 6px #121315, -3px -3px 6px #222527; 
        transform: translateY(2px); 
      }
      .neo-interactive:active { 
        box-shadow: inset 3px 3px 6px #121315, inset -3px -3px 6px #222527; 
        transform: translateY(4px); 
      }
    `,
  },
  StrukturData: {
    fonts: [
      'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700;900&family=JetBrains+Mono:wght@400;600;800&display=swap',
    ],
    css: `
      :root {
        --font-sans: "Space Grotesk", system-ui, sans-serif;
        --font-mono: "JetBrains Mono", monospace;
      }
      body { 
        background-color: #fdfaf5; 
        color: #000; 
        font-family: "Space Grotesk", system-ui, sans-serif; 
        overflow-x: hidden; 
      }
      .brutal-border { border: 4px solid #000; }
      .brutal-shadow { 
        box-shadow: 8px 8px 0px 0px rgba(0,0,0,1); 
        transition: all 0.15s cubic-bezier(0.4,0,0.2,1); 
      }
      .brutal-shadow:hover { 
        box-shadow: 12px 12px 0px 0px rgba(0,0,0,1); 
        transform: translate(-4px,-4px); 
      }
      .brutal-shadow:active { 
        box-shadow: 0px 0px 0px 0px rgba(0,0,0,1); 
        transform: translate(8px,8px); 
      }
      .brutal-shadow-sm { box-shadow: 4px 4px 0px 0px rgba(0,0,0,1); }
      .brutal-shadow-md { box-shadow: 6px 6px 0px 0px rgba(0,0,0,1); }
    `,
  },
  AuraKaca: {
    fonts: [
      'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
    ],
    css: `
      :root { --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif; }
      body { 
        background-color: #0B1221; 
        font-family: "Inter", ui-sans-serif, system-ui, sans-serif; 
      }
    `,
  },
};

/**
 * Exports portfolio as a standalone ZIP with:
 *   - index.html (uses Tailwind Play CDN for 100% accurate styling)
 *   - README.txt
 *
 * Tailwind Play CDN scans the HTML and generates CSS on-the-fly, ensuring
 * the standalone HTML looks IDENTICAL to the live preview.
 *
 * @param elementId   DOM element ID wrapping the rendered portfolio.
 * @param fileName    Base name for the downloaded ZIP file.
 * @param docTitle    Title for the HTML <title> tag.
 * @param templateId  Active portfolio template ID (e.g. "BentoGelap").
 */
export const exportPortfolioToZip = async (
  elementId: string,
  fileName: string = 'portfolio',
  docTitle: string = 'My Portfolio',
  templateId: string = 'BentoGelap'
): Promise<void> => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with ID "${elementId}" not found`);
    alert('Error: Portfolio element not found');
    return;
  }

  const JSZip = (await import('jszip')).default;

  // ── 1. Get template config ──
  const templateConfig = TEMPLATE_CSS[templateId] || TEMPLATE_CSS['BentoGelap'];
  const fontLinks = templateConfig.fonts
    .map((url) => `  <link rel="stylesheet" href="${url}" />`)
    .join('\n');

  // ── 2. Wait for animations to complete (give motion components time to animate in) ──
  await new Promise(resolve => setTimeout(resolve, 1000));

  // ── 3. Clone element and process it ──
  const clone = element.cloneNode(true) as HTMLElement;

  // Remove any wrapper divs that are just for preview layout
  // (keep only the actual portfolio content)
  const actualContent = clone.querySelector('[class*="min-h-screen"]') || clone;

  // ── 4. Strip Framer Motion artifacts and force visible state ──
  const allElements = actualContent.querySelectorAll('*');
  allElements.forEach((el) => {
    // Force all elements to be visible and in their final position
    // Remove ALL inline styles (they come from motion animations)
    el.removeAttribute('style');
    
    // Remove motion-specific data attributes
    Array.from(el.attributes).forEach(attr => {
      if (attr.name.startsWith('data-framer') || 
          attr.name.startsWith('data-projection') ||
          attr.name.startsWith('data-motion')) {
        el.removeAttribute(attr.name);
      }
    });
  });

  // ── 5. Embed images as data-URLs ──
  const imgEls = Array.from(actualContent.querySelectorAll<HTMLImageElement>('img'));
  await Promise.all(
    imgEls.map(async (img) => {
      if (!img.src || img.src.startsWith('data:')) return;
      try {
        const res = await fetch(img.src);
        const blob = await res.blob();
        await new Promise<void>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => { 
            img.src = reader.result as string; 
            resolve(); 
          };
          reader.readAsDataURL(blob);
        });
      } catch (err) {
        console.warn('Failed to embed image:', img.src, err);
        // Keep original src as fallback
      }
    })
  );

  // ── 6. Build standalone HTML with Tailwind Play CDN ──
  // Tailwind Play CDN will scan all class names and generate CSS automatically
  const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${docTitle}</title>
${fontLinks}
  <!-- Tailwind Play CDN — generates CSS from class names automatically -->
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
/* ── Template-specific custom CSS ── */
${templateConfig.css}

/* ── Utility classes ── */
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(59,130,246,0.5); border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(59,130,246,0.7); }

/* ── Ensure proper rendering ── */
* { box-sizing: border-box; }
body { margin: 0; padding: 0; }

/* ── Force all elements to be visible (override any animation initial states) ── */
* { opacity: 1 !important; transform: none !important; }
  </style>
</head>
<body>
${actualContent.outerHTML}
</body>
</html>`;

  // ── 7. README ──
  const readme = `PORTFOLIO — ${docTitle}
${'='.repeat(50)}

File ini dihasilkan oleh JagoCV (https://jagocv.id).

CARA HOSTING MANDIRI
--------------------
1. Ekstrak file ZIP ini ke folder mana saja.
2. Buka index.html di browser untuk pratinjau lokal.
   (Butuh koneksi internet untuk memuat Tailwind CSS & Google Fonts)
3. Upload seluruh isi folder ke hosting statis pilihan Anda:
   - Netlify (drag & drop folder ke netlify.app/drop)
   - Vercel (vercel.com — connect via GitHub atau upload folder)
   - GitHub Pages (push ke repo, enable Pages di Settings)
   - Hostinger, Niagahoster, atau hosting lainnya

BUTUH BANTUAN HOSTING?
----------------------
Hubungi Admin JagoAI untuk bantuan deployment profesional:
  Nama  : Salman Ridwan
  WA    : +62895412194060
  Link  : https://wa.me/62895412194060

CATATAN TEKNIS
--------------
- File ini menggunakan Tailwind CSS CDN untuk styling
- Membutuhkan koneksi internet saat pertama kali dibuka
- Setelah di-host, akan ter-cache di browser pengunjung
- Untuk performa optimal, pertimbangkan build dengan Vite/Next.js
- Animasi dari preview tidak disertakan (memerlukan React runtime)

Dibuat dengan ❤ oleh JagoCV
`;

  // ── 8. Pack & download ──
  const zip = new JSZip();
  zip.file('index.html', html);
  zip.file('README.txt', readme);

  const blob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${fileName}.zip`;
  a.click();
  URL.revokeObjectURL(url);
};
