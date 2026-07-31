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
  imageUrl: string;
  readCount: number;
}

export interface EventItem {
  id: string;
  dateDay: string;
  dateMonthLabel: string;
  title: string;
  subtitle: string;
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
  type: DocumentTypeTag;
  label: string;
  labelThai: string;
  count: number;
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

export type AppCategoryId = string;

export interface AppCategory {
  id: AppCategoryId;
  label: string;
  backgroundColor: string;
  textColor: string;
}

export interface AppItem {
  id: string;
  name: string;
  descriptionThai: string;
  categoryId: AppCategoryId;
  company: string;
  usageCount: number;
  isNew: boolean;
  lastUsedAt: string;
  launchUrl: string;
}

export interface FavoriteAppLink {
  id: string;
  name: string;
  launchUrl: string;
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
