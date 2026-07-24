import * as React from 'react';

// SPFx's webpack css-loader chain crashes on `@import url(...)` for external
// stylesheets (postcss-import-parser), so external CSS (e.g. web fonts) is
// loaded as a <link> tag instead of a SCSS @import.
export function useExternalStylesheet(href: string): void {
  React.useEffect(() => {
    const existing = document.querySelector(`link[href="${href}"]`);
    if (existing) {
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }, [href]);
}
