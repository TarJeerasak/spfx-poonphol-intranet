import { formatThaiDate } from '../../../../shared/utils/formatThaiDate';
import { Announcement, NavLink, QuickLink } from '../../../../shared/types/content';

import heroBg from '../../assets/home/hero-bg.jpg';
import documentIcon from '../../assets/home/icons/quicklinks/document.svg';
import dtHelpdeskIcon from '../../assets/home/icons/quicklinks/dt-helpdesk.svg';
import telephoneListsIcon from '../../assets/home/icons/quicklinks/telephone-lists.svg';
import kmIcon from '../../assets/home/icons/quicklinks/km.svg';
import galleryIcon from '../../assets/home/icons/quicklinks/gallery.svg';
import moreAppsIcon from '../../assets/home/icons/quicklinks/more-apps.png';

export const heroBackgroundUrl = heroBg;

export const navLinks: NavLink[] = [
  { id: 'home', label: 'หน้าหลัก', href: '#', isActive: true },
  { id: 'knowledge', label: 'ความรู้', href: '#' },
  { id: 'documents', label: 'เอกสาร', href: '#' },
  { id: 'gallery', label: 'แกลเลอรี่', href: '#' },
  { id: 'about', label: 'เกี่ยวกับเรา', href: '#' }
];

export const quickAppSearches: string[] = ['Microsoft Word', 'Microsoft Excel', 'Adobe Photoshop'];

export const quickLinks: QuickLink[] = [
  { id: 'document', label: 'Document', iconUrl: documentIcon, backgroundColor: '#30705c' },
  { id: 'dt-helpdesk', label: 'DT Helpdesk', iconUrl: dtHelpdeskIcon, backgroundColor: '#80b835' },
  { id: 'telephone', label: 'Telephone Lists', iconUrl: telephoneListsIcon, backgroundColor: '#72b7a1' },
  { id: 'km', label: 'KM', iconUrl: kmIcon, backgroundColor: '#445a6c' },
  { id: 'gallery', label: 'Gallery', iconUrl: galleryIcon, backgroundColor: '#29444e' },
  { id: 'more-apps', label: 'More Apps', iconUrl: moreAppsIcon, backgroundColor: '#30705c' }
];

export const announcements: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Q2 Town Hall Meeting',
    description: 'Join us for the quarterly review and strategic updates',
    dateTimeLabel: `${formatThaiDate(new Date(2026, 5, 15))} เวลา 14:00 น.`
  },
  {
    id: 'ann-2',
    title: 'Project Kickoff',
    description: 'Initiate the new product development phase with stakeholders',
    dateTimeLabel: `${formatThaiDate(new Date(2026, 6, 1))} เวลา 10:00 น.`
  },
  {
    id: 'ann-3',
    title: 'Marketing Strategy Workshop',
    description: 'Collaborate on innovative marketing tactics for upcoming campaigns',
    dateTimeLabel: `${formatThaiDate(new Date(2026, 6, 10))} เวลา 13:00 น.`
  },
  {
    id: 'ann-4',
    title: 'Team Building Retreat',
    description: 'Enhance team dynamics and foster collaboration in a fun setting',
    dateTimeLabel: `${formatThaiDate(new Date(2026, 7, 5))} เวลา 09:00 น.`
  }
];
