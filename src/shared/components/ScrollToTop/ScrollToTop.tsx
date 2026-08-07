import * as React from 'react';
import { useLocation } from 'react-router-dom';

export function scrollPageToTop(anchor?: HTMLElement): void {
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

  const scrollingElement = document.scrollingElement;
  if (scrollingElement) {
    scrollingElement.scrollTop = 0;
    scrollingElement.scrollLeft = 0;
  }

  // Modern SharePoint pages use an internal scroll region instead of the
  // browser window. Reset every ancestor of this web part so the actual page
  // scroller is covered without depending on SharePoint's generated classes.
  let element = anchor?.parentElement;
  while (element) {
    element.scrollTop = 0;
    element.scrollLeft = 0;
    element = element.parentElement;
  }

  // Depending on the SharePoint host/version, the visible scroll region can
  // be a sibling of the web-part canvas rather than its ancestor. Reset only
  // elements that are currently vertically scrolled as a host-agnostic fallback.
  document.querySelectorAll<HTMLElement>('body *').forEach(candidate => {
    if (candidate.scrollTop > 0) {
      candidate.scrollTop = 0;
    }
  });
}

export function ScrollToTop(): React.ReactElement {
  const { pathname, key } = useLocation();
  const anchorRef = React.useRef<HTMLSpanElement>(null);

  React.useLayoutEffect(() => {
    const resetScroll = (): void => scrollPageToTop(anchorRef.current ?? undefined);
    resetScroll();

    // SharePoint may restore its scroll position asynchronously while the new
    // route and web-part content are rendering. Repeat briefly so that late
    // host updates cannot put the new page back at the previous position.
    const frameId = window.requestAnimationFrame(resetScroll);
    const timeoutIds = [50, 150, 300, 600].map(delay => window.setTimeout(resetScroll, delay));

    return () => {
      window.cancelAnimationFrame(frameId);
      timeoutIds.forEach(timeoutId => window.clearTimeout(timeoutId));
    };
  }, [pathname, key]);

  return <span ref={anchorRef} hidden />;
}
