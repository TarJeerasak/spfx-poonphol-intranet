import * as React from 'react';
import { Callout, DirectionalHint } from '@fluentui/react/lib/Callout';
import { DropdownProps } from 'react-day-picker';
import { Icon } from '../../../../shared/components/Icon/Icon';
import styles from './CalendarDropdown.module.scss';

// Replaces react-day-picker's default month/year `Dropdown` (a native <select>)
// with a fully custom popup list - a native <select>'s open listbox is
// browser/OS-rendered and can't reliably be restyled (highlight color, option
// padding) across browsers, which a custom list can fully control.
export function CalendarDropdown({ options, value, onChange, disabled, 'aria-label': ariaLabel }: DropdownProps): React.ReactElement {
  const [isOpen, setIsOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  const numericValue = Number(value);
  const selectedOption = options?.find(option => option.value === numericValue);

  const handleSelect = (optionValue: number): void => {
    setIsOpen(false);
    onChange?.({ target: { value: String(optionValue) } } as React.ChangeEvent<HTMLSelectElement>);
  };

  return (
    <span data-disabled={disabled}>
      <button
        type="button"
        ref={triggerRef}
        className={styles.trigger}
        onClick={() => setIsOpen(previous => !previous)}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {selectedOption?.label}
        <Icon name="chevronDown" size={14} className={styles.chevron} />
      </button>
      {isOpen && (
        <Callout
          target={triggerRef}
          onDismiss={() => setIsOpen(false)}
          directionalHint={DirectionalHint.bottomLeftEdge}
          isBeakVisible={false}
          gapSpace={4}
        >
          <ul className={styles.list} role="listbox" aria-label={ariaLabel}>
            {options?.map(option => (
              <li key={option.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={option.value === numericValue}
                  disabled={option.disabled}
                  className={option.value === numericValue ? `${styles.option} ${styles.optionSelected}` : styles.option}
                  onClick={() => handleSelect(option.value)}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        </Callout>
      )}
    </span>
  );
}
