import * as React from 'react';
import { Icon } from '../../../../shared/components/Icon/Icon';
import { DateRangeFilter } from './DateRangeFilter';
import styles from './FilterSidebar.module.scss';

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterSelectProps {
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
}

function FilterSelect({ label, value, options, onChange }: FilterSelectProps): React.ReactElement {
  return (
    <div className={styles.field}>
      <label className={styles.fieldLabel} htmlFor={`document-filter-${label}`}>
        {label}
      </label>
      <div className={styles.selectWrap}>
        <select
          id={`document-filter-${label}`}
          className={styles.select}
          value={value}
          onChange={event => onChange(event.target.value)}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <Icon name="chevronDown" size={16} className={styles.chevron} />
      </div>
    </div>
  );
}

export interface FilterSidebarProps {
  company: string;
  department: string;
  type: string;
  dateFrom: string;
  dateTo: string;
  showCompanyFilter?: boolean;
  showDepartmentFilter?: boolean;
  companyOptions: FilterOption[];
  departmentOptions: FilterOption[];
  typeOptions: FilterOption[];
  onCompanyChange: (value: string) => void;
  onDepartmentChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onDateRangeChange: (dateFrom: string, dateTo: string) => void;
  onClearAll: () => void;
}

export function FilterSidebar({
  company,
  department,
  type,
  dateFrom,
  dateTo,
  showCompanyFilter = true,
  showDepartmentFilter = true,
  companyOptions,
  departmentOptions,
  typeOptions,
  onCompanyChange,
  onDepartmentChange,
  onTypeChange,
  onDateRangeChange,
  onClearAll
}: FilterSidebarProps): React.ReactElement {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.headerRow}>
        <span className={styles.title}>ตัวกรอง</span>
        <button type="button" className={styles.clearButton} onClick={onClearAll}>
          ลบตัวกรอง
        </button>
      </div>
      <div className={styles.divider} />
      {showCompanyFilter && (
        <FilterSelect label="บริษัท" value={company} options={companyOptions} onChange={onCompanyChange} />
      )}
      {showDepartmentFilter && (
        <FilterSelect label="แผนก" value={department} options={departmentOptions} onChange={onDepartmentChange} />
      )}
      <FilterSelect label="ประเภท" value={type} options={typeOptions} onChange={onTypeChange} />
      <DateRangeFilter dateFrom={dateFrom} dateTo={dateTo} onChange={onDateRangeChange} />
    </aside>
  );
}
