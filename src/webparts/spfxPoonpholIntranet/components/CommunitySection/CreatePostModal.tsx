import * as React from 'react';
import { Modal } from '../../../../shared/components/Modal/Modal';
import { Button } from '../../../../shared/components/Button/Button';
import { Icon } from '../../../../shared/components/Icon/Icon';
import { getCurrentUser, ICurrentUser } from '../../../../shared/services/currentUser';
import { buildUserPhotoUrl } from '../../../../shared/utils/buildUserPhotoUrl';
import { CommunityPost } from '../../../../shared/types/content';
import { createCommunityPost, getAttachmentFileName, updateCommunityPost } from '../../services/communityService';
import styles from './CreatePostModal.module.scss';

export interface CreatePostModalProps {
  isOpen: boolean;
  editingPost?: CommunityPost;
  onClose: () => void;
  onCreated: () => void;
}

interface ISelectedMedia {
  file: File;
  previewUrl: string;
  isVideo: boolean;
}

function isImageOrVideoFile(file: File): boolean {
  return file.type.startsWith('image/') || file.type.startsWith('video/');
}

export function CreatePostModal({ isOpen, editingPost, onClose, onCreated }: CreatePostModalProps): React.ReactElement {
  const [currentUser, setCurrentUser] = React.useState<ICurrentUser | undefined>(undefined);
  const [description, setDescription] = React.useState('');
  const [images, setImages] = React.useState<ISelectedMedia[]>([]);
  const [existingImageUrls, setExistingImageUrls] = React.useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | undefined>(undefined);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (!isOpen) {
      return;
    }

    getCurrentUser()
      .then(setCurrentUser)
      .catch(() => {
        // Post can still be submitted; Email_Created is left blank if lookup fails.
      });
  }, [isOpen]);

  React.useEffect(() => {
    if (!isOpen) {
      return;
    }

    setDescription(editingPost?.text ?? '');
    setExistingImageUrls(editingPost?.imageUrls ?? []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, editingPost?.id]);

  function resetForm(): void {
    images.forEach(image => URL.revokeObjectURL(image.previewUrl));
    setDescription('');
    setImages([]);
    setExistingImageUrls([]);
    setErrorMessage(undefined);
    setIsSubmitting(false);
  }

  function handleClose(): void {
    if (isSubmitting) {
      return;
    }
    resetForm();
    onClose();
  }

  function handleFilesSelected(event: React.ChangeEvent<HTMLInputElement>): void {
    const selectedFiles = Array.from(event.target.files ?? []).filter(isImageOrVideoFile);
    event.target.value = '';

    if (selectedFiles.length === 0) {
      return;
    }

    setImages(current => [
      ...current,
      ...selectedFiles.map(file => ({ file, previewUrl: URL.createObjectURL(file), isVideo: file.type.startsWith('video/') }))
    ]);
  }

  function handleRemoveImage(index: number): void {
    setImages(current => {
      const next = [...current];
      const [removed] = next.splice(index, 1);
      if (removed) {
        URL.revokeObjectURL(removed.previewUrl);
      }
      return next;
    });
  }

  function handleRemoveExistingImage(url: string): void {
    setExistingImageUrls(current => current.filter(existingUrl => existingUrl !== url));
  }

  async function handleSubmit(): Promise<void> {
    const trimmedDescription = description.trim();
    if (!trimmedDescription && images.length === 0 && existingImageUrls.length === 0) {
      setErrorMessage('กรุณาใส่ข้อความหรือไฟล์แนบอย่างน้อยหนึ่งอย่าง');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(undefined);

    try {
      if (editingPost) {
        const removedFileNames = editingPost.imageUrls
          .filter(url => existingImageUrls.indexOf(url) === -1)
          .map(getAttachmentFileName);

        await updateCommunityPost(
          Number(editingPost.id),
          trimmedDescription,
          images.map(image => image.file),
          removedFileNames
        );
      } else {
        await createCommunityPost(
          trimmedDescription,
          currentUser?.id ?? 0,
          images.map(image => image.file)
        );
      }
      resetForm();
      onCreated();
      onClose();
    } catch {
      setErrorMessage(editingPost ? 'ไม่สามารถบันทึกโพสต์ได้ กรุณาลองใหม่อีกครั้ง' : 'ไม่สามารถสร้างโพสต์ได้ กรุณาลองใหม่อีกครั้ง');
      setIsSubmitting(false);
    }
  }

  const canSubmit =
    (description.trim().length > 0 || images.length > 0 || existingImageUrls.length > 0) && !isSubmitting;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={editingPost ? 'แก้ไขโพสต์' : 'สร้างโพสต์ใหม่'}
      footer={
        <>
          <Button
            variant="outline"
            style={{ minWidth: 112, padding: '10px 20px', fontSize: 14 }}
            onClick={handleClose}
            disabled={isSubmitting}
          >
            ยกเลิก
          </Button>
          <Button
            variant="primary"
            style={{ background: '#71b87f', minWidth: 112, padding: '10px 20px' }}
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            {isSubmitting ? (editingPost ? 'กำลังบันทึก...' : 'กำลังโพสต์...') : editingPost ? 'บันทึก' : 'โพสต์'}
          </Button>
        </>
      }
    >
      <div className={styles.authorRow}>
        <img src={buildUserPhotoUrl(currentUser?.email)} alt="" className={styles.avatar} />
        <div className={styles.authorText}>
          <span className={styles.authorName}>{currentUser?.displayName || 'กำลังโหลด...'}</span>
          <span className={styles.authorSubtitle}>โพสต์ถึง Poonphol Community</span>
        </div>
      </div>

      <textarea
        className={styles.textarea}
        placeholder="คุณกำลังคิดอะไรอยู่?"
        value={description}
        onChange={event => setDescription(event.target.value)}
        rows={5}
        autoFocus
      />

      {(existingImageUrls.length > 0 || images.length > 0) && (
        <div className={styles.previewGrid}>
          {existingImageUrls.map(url => (
            <div key={url} className={styles.previewTile}>
              <img src={url} alt="" />
              <button
                type="button"
                className={styles.removeButton}
                onClick={() => handleRemoveExistingImage(url)}
                aria-label="ลบรูปภาพ"
              >
                <Icon name="close" size={14} />
              </button>
            </div>
          ))}
          {images.map((image, index) => (
            <div key={image.previewUrl} className={styles.previewTile}>
              {image.isVideo ? (
                <video src={image.previewUrl} muted />
              ) : (
                <img src={image.previewUrl} alt="" />
              )}
              <button
                type="button"
                className={styles.removeButton}
                onClick={() => handleRemoveImage(index)}
                aria-label="ลบไฟล์แนบ"
              >
                <Icon name="close" size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        className={styles.hiddenFileInput}
        onChange={handleFilesSelected}
      />
      <button type="button" className={styles.addImageButton} onClick={() => fileInputRef.current?.click()}>
        <Icon name="image" size={18} />
        เพิ่มรูปภาพ/วิดีโอ
      </button>

      {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
    </Modal>
  );
}
