import * as React from 'react';

export type IconName =
  | 'chevronDown'
  | 'search'
  | 'calendar'
  | 'clock'
  | 'location'
  | 'arrowRight'
  | 'arrowLeft'
  | 'bell'
  | 'document'
  | 'menuBook'
  | 'plus'
  | 'like'
  | 'shieldCheck'
  | 'clipboardList'
  | 'fileEdit'
  | 'megaphone'
  | 'download'
  | 'close'
  | 'image';

export interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
}

const PATHS: Record<IconName, React.ReactNode> = {
  chevronDown: <path d="M6 9l6 6 6-6" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </>
  ),
  location: (
    <>
      <path d="M12 21s-7-6.1-7-11a7 7 0 1 1 14 0c0 4.9-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  arrowRight: <path d="M5 12h14M13 6l6 6-6 6" />,
  arrowLeft: <path d="M19 12H5M11 6l-6 6 6 6" />,
  bell: (
    <>
      <path d="M6 9a6 6 0 0 1 12 0v5l1.5 3h-15L6 14V9z" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </>
  ),
  document: (
    <>
      <path d="M6 3h9l4 4v14H6V3z" />
      <path d="M9 12h6M9 16h6" />
    </>
  ),
  menuBook: (
    <>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H12v18H6.5A2.5 2.5 0 0 1 4 18.5v-13z" />
      <path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H12v18h5.5a2.5 2.5 0 0 0 2.5-2.5v-13z" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  like: (
    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3v11z" />
  ),
  shieldCheck: (
    <>
      <path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  clipboardList: (
    <>
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 3h6v3H9z" />
      <path d="M8 11h8M8 15h8M8 19h5" />
    </>
  ),
  fileEdit: (
    <>
      <path d="M6 3h9l4 4v14H6V3z" />
      <path d="M9.5 15.5l6-6 2 2-6 6H9.5v-2z" />
    </>
  ),
  megaphone: (
    <>
      <path d="M3 10v4a1 1 0 0 0 1 1h2l3 6h2l-1-6h3l7 4V5l-7 4H6a1 1 0 0 0-1 1z" />
      <path d="M9 15v4a2 2 0 0 0 4 0v-2" />
    </>
  ),
  download: (
    <>
      <path d="M12 3v12M7 10l5 5 5-5" />
      <path d="M5 21h14" />
    </>
  ),
  close: <path d="M6 6l12 12M18 6L6 18" />,
  image: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="9" cy="10" r="2" />
      <path d="M21 16l-5.5-5.5L6 19" />
    </>
  )
};

export function Icon({ name, size = 20, className }: IconProps): React.ReactElement {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}
