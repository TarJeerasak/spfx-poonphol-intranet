import * as React from 'react';
import { Icon } from '../Icon/Icon';
import styles from './Dropdown.module.scss';

export interface DropdownOption {
  value: string;
  label: string;
}

export interface DropdownProps {
  label: string;
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  className?: string;
}

export function Dropdown({ label, value, options, onChange, className }: DropdownProps): React.ReactElement {
  const [isOpen, setIsOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const selected = options.find(option => option.value === value);

  React.useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleOutsideClick = (event: MouseEvent): void => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={rootRef} className={`${styles.root} ${className ?? ''}`}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setIsOpen(current => !current)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={label}
      >
        <span className={styles.triggerLabel}>{selected?.label ?? value}</span>
        <Icon name="chevronDown" size={16} className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`} />
      </button>

      {isOpen && (
        <ul className={styles.menu} role="listbox" aria-label={label}>
          {options.map(option => (
            <li key={option.value}>
              <button
                type="button"
                role="option"
                aria-selected={option.value === value}
                className={`${styles.option} ${option.value === value ? styles.optionSelected : ''}`}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
