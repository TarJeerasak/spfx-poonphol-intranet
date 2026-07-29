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

export interface QuickLink {
  id: string;
  label: string;
  iconUrl: string;
  backgroundColor: string;
}

export interface NavLink {
  id: string;
  label: string;
  href: string;
  isActive?: boolean;
}
