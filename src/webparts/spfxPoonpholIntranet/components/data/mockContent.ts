import { NavLink, QuickLink } from '../../../../shared/types/content';

import heroBg from '../../assets/home/hero-bg.jpg';
import documentIcon from '../../assets/home/icons/quicklinks/document.svg';
import dtHelpdeskIcon from '../../assets/home/icons/quicklinks/dt-helpdesk.svg';
import telephoneListsIcon from '../../assets/home/icons/quicklinks/telephone-lists.svg';
import kmIcon from '../../assets/home/icons/quicklinks/km.svg';
import galleryIcon from '../../assets/home/icons/quicklinks/gallery.svg';
import moreAppsIcon from '../../assets/home/icons/quicklinks/more-apps.png';

export const heroBackgroundUrl = heroBg;

export const navLinks: NavLink[] = [
  { id: 'home', label: 'หน้าหลัก', href: '#', to: '/' },
  { id: 'knowledge', label: 'ความรู้', href: '#', to: '/knowledge' },
  { id: 'documents', label: 'เอกสาร', href: '#', to: '/documents' },
  { id: 'gallery', label: 'แกลเลอรี่', href: '#' },
  { id: 'about', label: 'เกี่ยวกับเรา', href: '#' }
];

export const quickLinks: QuickLink[] = [
  { id: 'document', label: 'Document', iconUrl: documentIcon, backgroundColor: '#30705c', to: '/documents' },
  { id: 'dt-helpdesk', label: 'DT Helpdesk', iconUrl: dtHelpdeskIcon, backgroundColor: '#80b835' },
  { id: 'telephone', label: 'Telephone Lists', iconUrl: telephoneListsIcon, backgroundColor: '#72b7a1', to: '/telephone-list' },
  { id: 'km', label: 'KM', iconUrl: kmIcon, backgroundColor: '#445a6c', to: '/knowledge' },
  { id: 'gallery', label: 'Gallery', iconUrl: galleryIcon, backgroundColor: '#29444e' },
  { id: 'more-apps', label: 'More Apps', iconUrl: moreAppsIcon, backgroundColor: '#30705c', to: '/more-apps' }
];
