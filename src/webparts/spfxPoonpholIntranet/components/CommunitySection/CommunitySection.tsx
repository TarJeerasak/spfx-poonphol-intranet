import * as React from 'react';
import { SectionHeader } from '../../../../shared/components/SectionHeader/SectionHeader';
import { SectionFooter } from '../../../../shared/components/SectionFooter/SectionFooter';
import { Button } from '../../../../shared/components/Button/Button';
import { useScrollReveal } from '../../../../shared/hooks/useScrollReveal';
import { CommunityPost } from '../../../../shared/types/content';
import { useCommunityLikes } from '../../hooks/useCommunityLikes';
import { CommunityPostCard } from './CommunityPostCard';
import communityIcon from '../../assets/home/icons/sections/community.svg';
import styles from './CommunitySection.module.scss';

export interface CommunitySectionProps {
  posts: CommunityPost[];
}

export function CommunitySection({ posts }: CommunitySectionProps): React.ReactElement {
  const { getLikeState, toggleLike } = useCommunityLikes(posts);
  const [ref, isVisible] = useScrollReveal<HTMLElement>();

  return (
    <section ref={ref} className={`${styles.section} ${isVisible ? styles.isVisible : ''}`}>
      <SectionHeader
        iconUrl={communityIcon}
        tintColor="#71b87f"
        title="Poonphol Community"
        subtitle="แบ่งปันเรื่องราวดีๆ ในองค์กร"
        rightSlot={
          <Button variant="primary" style={{ background: '#71b87f', height: 32, padding: '4px 12px' }}>
            สร้างโพสต์
          </Button>
        }
      />
      <div className={styles.divider} />
      <div className={styles.list}>
        {posts.map(post => (
          <CommunityPostCard
            key={post.id}
            post={post}
            likeState={getLikeState(post)}
            onToggleLike={() => toggleLike(post)}
          />
        ))}
      </div>
      <SectionFooter />
    </section>
  );
}
