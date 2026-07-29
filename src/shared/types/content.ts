export interface Announcement {
  id: string;
  title: string;
  description: string;
  dateTimeLabel: string;
}

export interface NewsItem {
  id: string;
  tag: string;
  tagColor: string;
  title: string;
  excerpt: string;
  dateLabel: string;
  timeLabel: string;
  locationLabel: string;
  imageUrl: string;
  authorName: string;
  authorAvatarUrl: string;
}

export interface KnowledgeCategory {
  id: string;
  label: string;
}

export interface KnowledgeItem {
  id: string;
  categoryId: string;
  tags: string[];
  title: string;
  progressLabel: string;
  progressPercent: number;
  locationLabel: string;
  imageUrl: string;
}

export interface EventItem {
  id: string;
  dateDay: string;
  dateMonthLabel: string;
  title: string;
  timeLabel: string;
  locationLabel: string;
  attendeeAvatarUrls: string[];
  overflowCount: number;
  imageUrl: string;
}

export interface CommunityPost {
  id: string;
  authorName: string;
  authorRole: string;
  postedAtLabel: string;
  authorAvatarUrl: string;
  text: string;
  imageUrls: string[];
  likeCount: number;
}

export type DocumentFileType = 'word' | 'excel' | 'pdf' | 'powerpoint';

export type DocumentTypeTag = 'Policy' | 'SOP' | 'Form' | 'Manual' | 'Announcement' | 'Report' | 'Template';

export interface DocumentCategorySummary {
  id: string;
  label: string;
  labelThai: string;
  count: number;
  iconName: string;
  tintColor: string;
}

export interface DocumentItem {
  id: string;
  name: string;
  nameThai: string;
  fileType: DocumentFileType;
  type: DocumentTypeTag;
  company: string;
  department: string;
  lastUpdate: string;
  fileUrl: string;
}

export interface QuickLink {
  id: string;
  label: string;
  iconUrl: string;
  backgroundColor: string;
  to?: string;
}

export interface NavLink {
  id: string;
  label: string;
  href: string;
  to?: string;
}
