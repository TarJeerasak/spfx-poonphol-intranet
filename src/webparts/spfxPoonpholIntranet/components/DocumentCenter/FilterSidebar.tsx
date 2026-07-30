import * as React from 'react';
import { Icon } from '../../../../shared/components/Icon/Icon';
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
  companyOptions: FilterOption[];
  departmentOptions: FilterOption[];
  typeOptions: FilterOption[];
  onCompanyChange: (value: string) => void;
  onDepartmentChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onClearAll: () => void;
}

export function FilterSidebar({
  company,
  department,
  type,
  companyOptions,
  departmentOptions,
  typeOptions,
  onCompanyChange,
  onDepartmentChange,
  onTypeChange,
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
      <FilterSelect label="บริษัท" value={company} options={companyOptions} onChange={onCompanyChange} />
      <FilterSelect label="แผนก" value={department} options={departmentOptions} onChange={onDepartmentChange} />
      <FilterSelect label="ประเภท" value={type} options={typeOptions} onChange={onTypeChange} />
      <div className={styles.field}>
        <span className={styles.fieldLabel}>วันที่</span>
        <div className={styles.dateBox}>
          <span className={styles.datePlaceholder}>เลือกช่วงเวลา</span>
          <Icon name="calendar" size={16} className={styles.dateIcon} />
        </div>
      </div>
    </aside>
  );
}
