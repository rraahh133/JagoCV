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
    
    // Get the actual height of the content (not limited to A4)
    const actualHeight = element.scrollHeight;
    const actualWidth = element.offsetWidth;
    
    console.log(`Exporting PNG: ${actualWidth}x${actualHeight}px`);
    
    // Use html-to-image to convert element to PNG with full height
    const dataUrl = await toPng(element, {
      quality: 1,
      pixelRatio: 2,
      backgroundColor: '#ffffff',
      fontEmbedCSS: fontCSS,
      width: actualWidth,
      height: actualHeight,
    });

    // Convert data URL to blob and download
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `${fileName}.png`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);

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
      });
      
      // Calculate scaling factor
      const scale = pdfWidth / (contentWidth / 3.7795275591); // Convert px to mm
      
      // Add each page
      for (let i = 0; i < pageCount; i++) {
        if (i > 0) {
          pdf.addPage();
        }
        
        // Calculate the Y offset for this page
        const yOffset = -(i * A4_HEIGHT_PX * scale);
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
