import * as React from 'react';
import { Icon } from '../../../../shared/components/Icon/Icon';
import styles from './FilterSidebar.module.scss';

export interface FilterSelectProps {
  label: string;
  value: string;
  options: string[];
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
            <option key={option} value={option}>
              {option}
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
  companyOptions: string[];
  departmentOptions: string[];
  typeOptions: string[];
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
        <span className={styles.title}>Filter</span>
        <button type="button" className={styles.clearButton} onClick={onClearAll}>
          Clear All
        </button>
      </div>
      <div className={styles.divider} />
      <FilterSelect label="Company" value={company} options={companyOptions} onChange={onCompanyChange} />
      <FilterSelect label="Department" value={department} options={departmentOptions} onChange={onDepartmentChange} />
      <FilterSelect label="Document Type" value={type} options={typeOptions} onChange={onTypeChange} />
      <div className={styles.field}>
        <span className={styles.fieldLabel}>Date</span>
        <div className={styles.dateBox}>
          <span className={styles.datePlaceholder}>เลือกช่วงเวลา</span>
          <Icon name="calendar" size={16} className={styles.dateIcon} />
        </div>
      </div>
    </aside>
  );
}
