import * as React from 'react';
import { Callout, DirectionalHint } from '@fluentui/react/lib/Callout';
import { DateRange, DayPicker, Formatters } from 'react-day-picker';
import { th } from 'react-day-picker/locale';
import 'react-day-picker/style.css';
import { Icon } from '../../../../shared/components/Icon/Icon';
import { BUDDHIST_ERA_OFFSET } from '../../../../shared/utils/formatThaiDate';
import { formatThaiDateShort } from '../../../../shared/utils/formatThaiDateShort';
import { parseIsoDate, toIsoDate } from '../../../../shared/utils/isoDate';
import { CalendarDropdown } from './CalendarDropdown';
import styles from './DateRangeFilter.module.scss';

const CALENDAR_COMPONENTS = { Dropdown: CalendarDropdown };

export interface DateRangeFilterProps {
  dateFrom: string;
  dateTo: string;
  onChange: (dateFrom: string, dateTo: string) => void;
}

const MIN_SELECTABLE_YEAR_BE = 2565;
const MIN_SELECTABLE_MONTH = new Date(MIN_SELECTABLE_YEAR_BE - BUDDHIST_ERA_OFFSET, 0, 1);

// Only the year dropdown's label is overridden - its underlying `value` (used to
// track the current selection and to pass back to onSelect) stays the Gregorian
// year react-day-picker manages internally, so the app/backend still only ever
// deals in Gregorian dates.
const CALENDAR_FORMATTERS: Partial<Formatters> = {
  formatYearDropdown: year => String(year.getFullYear() + BUDDHIST_ERA_OFFSET)
};

function formatRangeLabel(range: DateRange | undefined): string {
  if (!range?.from) {
    return 'ทั้งหมด';
  }
  if (!range.to || toIsoDate(range.to) === toIsoDate(range.from)) {
    return formatThaiDateShort(range.from);
  }
  return `${formatThaiDateShort(range.from)} - ${formatThaiDateShort(range.to)}`;
}

export function DateRangeFilter({ dateFrom, dateTo, onChange }: DateRangeFilterProps): React.ReactElement {
  const [isOpen, setIsOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  const selectedRange: DateRange | undefined = dateFrom ? { from: parseIsoDate(dateFrom), to: parseIsoDate(dateTo) } : undefined;

  const handleSelect = (range: DateRange | undefined): void => {
    onChange(toIsoDate(range?.from), toIsoDate(range?.to));
  };

  const handleReset = (): void => {
    onChange('', '');
    setIsOpen(false);
  };

  return (
    <div className={styles.field}>
      <span className={styles.fieldLabel}>วันที่</span>
      <button
        type="button"
        ref={triggerRef}
        className={styles.trigger}
        onClick={() => setIsOpen(previous => !previous)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <span className={styles.triggerLabel}>{formatRangeLabel(selectedRange)}</span>
        <Icon name="calendar" size={16} className={styles.triggerIcon} />
      </button>
      {isOpen && (
        <Callout
          target={triggerRef}
          onDismiss={() => setIsOpen(false)}
          directionalHint={DirectionalHint.bottomLeftEdge}
          isBeakVisible={false}
          gapSpace={8}
        >
          <div className={styles.calendarWrap}>
            <DayPicker
              mode="range"
              locale={th}
              selected={selectedRange}
              onSelect={handleSelect}
              defaultMonth={selectedRange?.from ?? new Date()}
              captionLayout="dropdown"
              startMonth={MIN_SELECTABLE_MONTH}
              endMonth={new Date()}
              formatters={CALENDAR_FORMATTERS}
              components={CALENDAR_COMPONENTS}
              showOutsideDays
            />
            <div className={styles.calloutFooter}>
              <button type="button" className={styles.resetButton} onClick={handleReset}>
                ทั้งหมด
              </button>
            </div>
          </div>
        </Callout>
      )}
    </div>
  );
}
