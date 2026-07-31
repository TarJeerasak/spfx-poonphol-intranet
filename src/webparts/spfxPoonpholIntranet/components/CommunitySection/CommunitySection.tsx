import * as React from 'react';
import { SectionHeader } from '../../../../shared/components/SectionHeader/SectionHeader';
import { SectionFooter } from '../../../../shared/components/SectionFooter/SectionFooter';
import { Button } from '../../../../shared/components/Button/Button';
import { Modal } from '../../../../shared/components/Modal/Modal';
import { useScrollReveal } from '../../../../shared/hooks/useScrollReveal';
import { CommunityPost } from '../../../../shared/types/content';
import { useCommunityLikes } from '../../hooks/useCommunityLikes';
import { deactivateCommunityPost } from '../../services/communityService';
import { CommunityPostCard } from './CommunityPostCard';
import { CreatePostModal } from './CreatePostModal';
import communityIcon from '../../assets/home/icons/sections/community.svg';
import styles from './CommunitySection.module.scss';

export interface CommunitySectionProps {
  posts: CommunityPost[];
  onPostCreated?: () => void;
}

export function CommunitySection({ posts, onPostCreated }: CommunitySectionProps): React.ReactElement {
  const { currentUserEmail, getLikeState, toggleLike } = useCommunityLikes(posts);
  const [ref, isVisible] = useScrollReveal<HTMLElement>();
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [editingPost, setEditingPost] = React.useState<CommunityPost | undefined>(undefined);
  const [deletingPost, setDeletingPost] = React.useState<CommunityPost | undefined>(undefined);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [deleteErrorMessage, setDeleteErrorMessage] = React.useState<string | undefined>(undefined);

  function handleCloseEditor(): void {
    setIsCreateModalOpen(false);
    setEditingPost(undefined);
  }

  function handleSaved(): void {
    handleCloseEditor();
    onPostCreated?.();
  }

  function handleCloseDeleteConfirm(): void {
    if (isDeleting) {
      return;
    }
    setDeletingPost(undefined);
    setDeleteErrorMessage(undefined);
  }

  async function handleConfirmDelete(): Promise<void> {
    if (!deletingPost) {
      return;
    }

    setIsDeleting(true);
    setDeleteErrorMessage(undefined);

    try {
      await deactivateCommunityPost(Number(deletingPost.id));
      setDeletingPost(undefined);
      onPostCreated?.();
    } catch {
      setDeleteErrorMessage('ไม่สามารถลบโพสต์ได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <section ref={ref} className={`${styles.section} ${isVisible ? styles.isVisible : ''}`}>
      <SectionHeader
        iconUrl={communityIcon}
        tintColor="#71b87f"
        title="Poonphol Community"
        subtitle="แบ่งปันเรื่องราวดีๆ ในองค์กร"
        rightSlot={
          <Button
            variant="primary"
            style={{ background: '#71b87f', height: 32, padding: '4px 12px' }}
            onClick={() => setIsCreateModalOpen(true)}
          >
            สร้างโพสต์
          </Button>
        }
      />
      <div className={styles.divider} />
      {posts.length > 0 ? (
        <div className={styles.list}>
          {posts.map(post => (
            <CommunityPostCard
              key={post.id}
              post={post}
              likeState={getLikeState(post)}
              canManage={!!currentUserEmail && currentUserEmail === post.authorEmail}
              onToggleLike={() => toggleLike(post)}
              onEdit={() => setEditingPost(post)}
              onDelete={() => setDeletingPost(post)}
            />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <p className={styles.emptyText}>ยังไม่มีโพสต์ มาเป็นคนแรกที่แบ่งปันเรื่องราวดีๆ กันเถอะ</p>
          <Button
            variant="primary"
            style={{ background: '#71b87f' }}
            onClick={() => setIsCreateModalOpen(true)}
          >
            สร้างโพสต์
          </Button>
        </div>
      )}
      <SectionFooter />
      <CreatePostModal
        isOpen={isCreateModalOpen || !!editingPost}
        editingPost={editingPost}
        onClose={handleCloseEditor}
        onCreated={handleSaved}
      />
      <Modal
        isOpen={!!deletingPost}
        onClose={handleCloseDeleteConfirm}
        title="ยืนยันการลบโพสต์"
        footer={
          <>
            <Button
              variant="outline"
              style={{ minWidth: 112, padding: '10px 20px', fontSize: 14 }}
              onClick={handleCloseDeleteConfirm}
              disabled={isDeleting}
            >
              ยกเลิก
            </Button>
            <Button
              variant="primary"
              style={{ background: '#d64545', minWidth: 112, padding: '10px 20px' }}
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'กำลังลบ...' : 'ลบโพสต์'}
            </Button>
          </>
        }
      >
        <p className={styles.deleteConfirmMessage}>คุณต้องการลบโพสต์นี้ใช่หรือไม่ การลบไม่สามารถย้อนกลับได้</p>
        {deleteErrorMessage && <p className={styles.deleteErrorMessage}>{deleteErrorMessage}</p>}
      </Modal>
    </section>
  );
}
