import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Icon } from '../Icon/Icon';
import styles from './Modal.module.scss';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children, footer }: ModalProps): React.ReactElement {
  React.useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return <></>;
  }

  return ReactDOM.createPortal(
    <div className={styles.overlay} onMouseDown={onClose}>
      <div className={styles.panel} role="dialog" aria-modal="true" aria-label={title} onMouseDown={event => event.stopPropagation()}>
        <div className={styles.header}>
          <p className={styles.title}>{title}</p>
          <button type="button" className={styles.closeButton} onClick={onClose} aria-label="ปิด">
            <Icon name="close" size={18} />
          </button>
        </div>
        <div className={styles.body}>{children}</div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>,
    document.body
  );
}
