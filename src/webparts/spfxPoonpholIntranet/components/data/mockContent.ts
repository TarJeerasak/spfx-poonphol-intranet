import { formatThaiDate } from '../../../../shared/utils/formatThaiDate';
import {
  Announcement,
  CommunityPost,
  EventItem,
  KnowledgeCategory,
  KnowledgeItem,
  NavLink,
  NewsItem,
  QuickLink
} from '../../../../shared/types/content';

import heroBg from '../../assets/home/hero-bg.jpg';
import newsFeatureImg from '../../assets/home/news-feature.jpg';
import newsThumbImg from '../../assets/home/news-thumb.jpg';
import kmThumbImg from '../../assets/home/km-thumb.jpg';
import eventFeatureImg from '../../assets/home/event-feature.jpg';
import eventThumbImg from '../../assets/home/event-thumb.jpg';
import communityAvatarImg from '../../assets/home/community-avatar.png';
import communityPostImg from '../../assets/home/community-post.jpg';
import ellipseAvatarImg from '../../assets/home/ellipse-avatar-small.png';
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

export const newsFeature: NewsItem = {
  id: 'news-feature',
  tag: 'Business',
  tagColor: '#63b37d',
  title: 'Group Orientation ประจำเดือนกรกฎาคม',
  excerpt: 'บรรยากาศกิจกรรม Group Orientation ประจำเดือนกรกฎาคม ที่ชั้น 20 อาคารสาธรธานี',
  dateLabel: formatThaiDate(new Date(2025, 5, 10)),
  timeLabel: '09:00 - 12:00',
  locationLabel: 'อาคาร A ชั้น 3 และ Online',
  imageUrl: newsFeatureImg
};

export const newsList: NewsItem[] = [
  {
    id: 'news-1',
    tag: 'Business',
    tagColor: '#63b37d',
    title: 'กิจกรรมพัฒนา Core Competency',
    excerpt: 'Did you come here for something in particular or just general Riker-bashing? And blowing into',
    dateLabel: formatThaiDate(new Date(2022, 11, 2)),
    timeLabel: '3 min. to read',
    locationLabel: 'Jenny kiaa',
    imageUrl: newsThumbImg
  },
  {
    id: 'news-2',
    tag: 'Activities',
    tagColor: '#d38f9a',
    title: 'กิจกรรม PPG Townhall 2024',
    excerpt: 'Did you come here for something in particular or just general Riker-bashing? And blowing into',
    dateLabel: formatThaiDate(new Date(2022, 11, 15)),
    timeLabel: '1 min. to read',
    locationLabel: 'Jenny kiaa',
    imageUrl: newsThumbImg
  },
  {
    id: 'news-3',
    tag: 'Activities',
    tagColor: '#d38f9a',
    title: 'ทำบุญครบรอบ 50 ปี',
    excerpt: 'Did you come here for something in particular or just general Riker-bashing? And blowing into',
    dateLabel: formatThaiDate(new Date(2022, 11, 3)),
    timeLabel: '1 min. to read',
    locationLabel: 'Jenny kiaa',
    imageUrl: newsThumbImg
  }
];

export const knowledgeCategories: KnowledgeCategory[] = [
  { id: 'all', label: 'ดูทั้งหมด' },
  { id: 'learning', label: 'Learning' },
  { id: 'mindset', label: 'Mindset' },
  { id: 'management', label: 'Management' }
];

export const knowledgeItems: KnowledgeItem[] = [
  {
    id: 'km-1',
    categoryId: 'mindset',
    tag: 'Hybrid',
    title: 'ETHICS MATTERS EP.1-4',
    progressLabel: 'ดูไปแล้ว 2 EP. 50%',
    progressPercent: 50,
    locationLabel: 'Virtual · Microsoft Teams',
    imageUrl: kmThumbImg
  },
  {
    id: 'km-2',
    categoryId: 'learning',
    tag: 'Hybrid',
    title: 'ETHICS MATTERS EP.1-4',
    progressLabel: 'ดูไปแล้ว 1 EP. 25%',
    progressPercent: 25,
    locationLabel: 'Virtual · Microsoft Teams',
    imageUrl: kmThumbImg
  },
  {
    id: 'km-3',
    categoryId: 'management',
    tag: 'Hybrid',
    title: 'ETHICS MATTERS EP.1-4',
    progressLabel: 'ดูไปแล้ว 4 EP. 100%',
    progressPercent: 100,
    locationLabel: 'Virtual · Microsoft Teams',
    imageUrl: kmThumbImg
  }
];

export const eventFeature = {
  title: 'DIGITAL DAY',
  subtitle: 'อัพเดตกลยุทธ์และทิศทางขององค์กร',
  dateLabel: formatThaiDate(new Date(2025, 5, 10)),
  timeLabel: '09:00 - 12:00',
  locationLabel: 'อาคาร A ชั้น 3 และ Online',
  imageUrl: eventFeatureImg
};

export const eventList: EventItem[] = [
  {
    id: 'event-1',
    dateDay: '13',
    dateMonthLabel: 'มิ.ย.',
    title: 'กิจกรรม Culture Talk',
    timeLabel: '08:00 - 12:00',
    locationLabel: 'จ.ระยอง',
    attendeeAvatarUrls: [ellipseAvatarImg, ellipseAvatarImg, ellipseAvatarImg],
    overflowCount: 3,
    imageUrl: eventThumbImg
  },
  {
    id: 'event-2',
    dateDay: '18',
    dateMonthLabel: 'มิ.ย.',
    title: 'Kensoa PPC Cluster Forum',
    timeLabel: '13:00 - 16:00',
    locationLabel: 'Bangkok Office',
    attendeeAvatarUrls: [ellipseAvatarImg, ellipseAvatarImg, ellipseAvatarImg],
    overflowCount: 3,
    imageUrl: eventThumbImg
  },
  {
    id: 'event-3',
    dateDay: '25',
    dateMonthLabel: 'มิ.ย.',
    title: 'Goodz All In Your Area',
    timeLabel: '09:00 - 17:00',
    locationLabel: 'Online',
    attendeeAvatarUrls: [ellipseAvatarImg, ellipseAvatarImg, ellipseAvatarImg],
    overflowCount: 3,
    imageUrl: eventThumbImg
  }
];

export const communityPosts: CommunityPost[] = [
  {
    id: 'post-1',
    authorName: 'Michael Chen',
    authorRole: 'Operations Manager',
    postedAtLabel: '2 hours ago',
    authorAvatarUrl: communityAvatarImg,
    text: "Great team collaboration today! Our Q2 project milestones are looking fantastic. Proud of everyone's dedication and hard work. 🎉",
    imageUrl: communityPostImg,
    likeCount: 24
  },
  {
    id: 'post-2',
    authorName: 'Michael Chen',
    authorRole: 'Operations Manager',
    postedAtLabel: '3 hours ago',
    authorAvatarUrl: communityAvatarImg,
    text: "Great team collaboration today! Our Q2 project milestones are looking fantastic. Proud of everyone's dedication and hard work. 🎉",
    likeCount: 24
  },
  {
    id: 'post-3',
    authorName: 'Michael Chen',
    authorRole: 'Operations Manager',
    postedAtLabel: '5 hours ago',
    authorAvatarUrl: communityAvatarImg,
    text: "Great team collaboration today! Our Q2 project milestones are looking fantastic. Proud of everyone's dedication and hard work. 🎉",
    likeCount: 24
  }
];
