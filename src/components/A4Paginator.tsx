import React, { useRef, useEffect, useState, useCallback } from 'react';

interface A4PaginatorProps {
  children: React.ReactNode;
  active: boolean;
}

// A4 page height in CSS pixels at 96 DPI (297mm)
const A4_PX = 1123;
// Margin at top of each new page (after page break)
const PAGE_TOP_MARGIN = 40;
// Elements whose bottom extends past (pageBottom - PAGE_BOTTOM_MARGIN) get pushed to next page
const PAGE_BOTTOM_MARGIN = 40;

/**
 * A4Paginator scans child `.page-break-avoid` elements and inserts white spacer
 * divs to push any element that would cross an A4 page boundary to the next page.
 *
 * Spacers remain in the DOM during export so that the captured image has clean
 * page breaks (white space at the bottom of each page).
 * Visual dashed-line indicators are overlaid and filtered out during export.
 */
export default function A4Paginator({ children, active }: A4PaginatorProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [pageCount, setPageCount] = useState(1);
  const isPaginating = useRef(false);

  const paginate = useCallback(() => {
    const container = contentRef.current;
    if (!active || !container || isPaginating.current) return;

    isPaginating.current = true;

    // ── 1. Remove all spacers from a previous run ──
    container.querySelectorAll('.page-spacer').forEach(el => el.remove());

    // Force synchronous reflow so measurements are clean
    void container.offsetHeight;

    // ── 2. Collect every element that should stay in one piece ──
    const elements = Array.from(
      container.querySelectorAll<HTMLElement>('.page-break-avoid')
    );

    const containerTop = container.getBoundingClientRect().top;

    // ── 3. Walk elements top-to-bottom and insert spacers ──
    for (const el of elements) {
      const rect  = el.getBoundingClientRect();
      const elTop = rect.top - containerTop;   // position relative to container
      const elBottom = rect.bottom - containerTop;
      const elHeight = rect.height;

      // Skip elements taller than the usable area of one page
      if (elHeight >= A4_PX - PAGE_TOP_MARGIN - PAGE_BOTTOM_MARGIN) continue;

      // Which page does the TOP of this element sit on?
      const pageIndex  = Math.floor(elTop / A4_PX);
      const pageBottom = (pageIndex + 1) * A4_PX;
      const safeBottom = pageBottom - PAGE_BOTTOM_MARGIN;

      // Does the element's bottom extend past the safe zone?
      if (elBottom > safeBottom && elTop < pageBottom) {
        // Don't push if the element already sits at the very start of a page
        // (it was already pushed here by a previous spacer)
        if (elTop <= pageIndex * A4_PX + 5) continue;

        // Spacer height = remaining space on current page + top margin on next page
        const spacerHeight = pageBottom - elTop + PAGE_TOP_MARGIN;

        if (spacerHeight > 0 && spacerHeight < A4_PX) {
          const spacer = document.createElement('div');
          spacer.className = 'page-spacer';
          spacer.style.height = `${spacerHeight}px`;
          spacer.style.width = '100%';
          spacer.style.flexShrink = '0';  // keep height in flex containers
          el.parentNode?.insertBefore(spacer, el);
          // Subsequent calls to getBoundingClientRect() on later elements
          // will automatically reflect the shift caused by this spacer.
        }
      }
    }

    // ── 4. Update page count ──
    const finalHeight = container.scrollHeight;
    setPageCount(Math.max(1, Math.ceil(finalHeight / A4_PX)));

    // Keep the flag raised briefly so that the ResizeObserver callback
    // (which fires because we just changed the DOM height) is ignored.
    setTimeout(() => {
      isPaginating.current = false;
    }, 300);
  }, [active]);

  useEffect(() => {
    if (!active) return;

    let debounceTimer: ReturnType<typeof setTimeout>;

    // Initial run after fonts / images have had time to load
    debounceTimer = setTimeout(paginate, 250);

    // Re-paginate when the container's intrinsic size changes
    const ro = new ResizeObserver(() => {
      if (!isPaginating.current) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(paginate, 200);
      }
    });

    if (contentRef.current) {
      ro.observe(contentRef.current);
    }

    return () => {
      clearTimeout(debounceTimer);
      ro.disconnect();
    };
  }, [active, children, paginate]);

  // ── Render ──
  if (!active) return <>{children}</>;

  return (
    <div className="relative w-full">
      {/* Measurable content wrapper */}
      <div ref={contentRef} className="relative w-full">
        {children}
      </div>

      {/* Visual page-break dashed lines (filtered out during PDF / PNG export) */}
      {pageCount > 1 &&
        Array.from({ length: pageCount - 1 }).map((_, idx) => (
          <div
            key={idx}
            className="absolute left-0 w-full pointer-events-none visual-page-break"
            style={{
              top: `${(idx + 1) * A4_PX}px`,
              height: '4px',
              background:
                'repeating-linear-gradient(90deg, #94a3b8 0, #94a3b8 8px, transparent 8px, transparent 16px)',
              opacity: 0.6,
              zIndex: 20,
            }}
          />
        ))}
    </div>
  );
}
