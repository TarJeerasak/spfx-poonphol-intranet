import * as React from 'react';
import { Dropdown } from '../../../../shared/components/Dropdown/Dropdown';
import { CompanyPhoneEntry, InternalExtensionEntry } from '../../../../shared/types/content';
import { useTelephoneListFeed } from '../../hooks/useTelephoneListFeed';
import { buildCompanyDirectoryCsv, buildExtensionDirectoryCsv } from '../../services/telephoneListService';
import bannerImageUrl from '../../assets/telephone-list/hero-banner.jpg';
import { DirectoryCard, DirectoryCellText, DirectoryCellTwoLine, DirectoryColumn } from './DirectoryCard';
import styles from './TelephoneListPage.module.scss';

const ALL_OPTION_LABEL = 'ทั้งหมด';

const UTF8_BOM = String.fromCharCode(0xfeff);

function downloadCsv(csv: string, fileName: string): void {
  const blob = new Blob([UTF8_BOM, csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

const COMPANY_COLUMNS: Array<DirectoryColumn<CompanyPhoneEntry>> = [
  {
    key: 'company',
    header: 'บริษัท',
    render: entry => <DirectoryCellTwoLine primary={entry.company} secondary={entry.branch || undefined} />
  },
  { key: 'phoneNumber', header: 'เบอร์โทรศัพท์', render: entry => <DirectoryCellText>{entry.phoneNumber}</DirectoryCellText> },
  { key: 'extension', header: 'ต่อ', render: entry => <DirectoryCellText>{entry.extension}</DirectoryCellText> }
];

const COMPANY_GRID_COLUMNS = 'minmax(220px, 1.4fr) minmax(160px, 1fr) minmax(120px, 1fr)';

const EXTENSION_COLUMNS: Array<DirectoryColumn<InternalExtensionEntry>> = [
  {
    key: 'contact',
    header: 'แผนก',
    render: entry => <DirectoryCellTwoLine primary={entry.contactName} secondary={entry.department} />
  },
  { key: 'location', header: 'สถานที่', render: entry => <DirectoryCellText>{entry.location}</DirectoryCellText> },
  { key: 'deskNumber', header: 'เบอร์ภายในหรือโต๊ะทำงาน', render: entry => <DirectoryCellText>{entry.deskNumber}</DirectoryCellText> }
];

const EXTENSION_GRID_COLUMNS = 'minmax(220px, 1.4fr) minmax(160px, 1fr) minmax(200px, 1fr)';

export function TelephoneListPage(): React.ReactElement {
  const {
    companyOptions,
    companyFilters,
    companyEntries,
    companyPage,
    companyPageCount,
    companyTotalCount,
    setCompanySearch,
    setCompanyFilter,
    setCompanyPage,
    departmentOptions,
    locationOptions,
    extensionFilters,
    extensionEntries,
    extensionPage,
    extensionPageCount,
    extensionTotalCount,
    setExtensionSearch,
    setExtensionDepartment,
    setExtensionLocation,
    setExtensionPage
  } = useTelephoneListFeed();

  const [companySearchDraft, setCompanySearchDraft] = React.useState(companyFilters.search);
  const [extensionSearchDraft, setExtensionSearchDraft] = React.useState(extensionFilters.search);

  const companyFilterOptions = [{ value: 'All', label: ALL_OPTION_LABEL }, ...companyOptions.map(value => ({ value, label: value }))];
  const departmentFilterOptions = [{ value: 'All', label: ALL_OPTION_LABEL }, ...departmentOptions.map(value => ({ value, label: value }))];
  const locationFilterOptions = [{ value: 'All', label: ALL_OPTION_LABEL }, ...locationOptions.map(value => ({ value, label: value }))];

  return (
    <div className={styles.page}>
      <section className={styles.banner} style={{ backgroundImage: `url(${bannerImageUrl})` }}>
        <div className={styles.bannerFade} />
        <div className={styles.bannerInner}>
          <h1 className={styles.bannerTitle}>Telephone List</h1>
          <p className={styles.bannerSubtitle}>ค้นหาเบอร์โทรศัพท์ภายในของกลุ่มพูลผล</p>
        </div>
      </section>

      <div className={styles.container}>
        <DirectoryCard
          title="หมายเลขโทรศัพท์บริษัทในกลุ่มพูลผล"
          toolbar={<Dropdown label="กรองตามบริษัท" value={companyFilters.company} options={companyFilterOptions} onChange={setCompanyFilter} />}
          searchPlaceholder="ค้นหา"
          searchAriaLabel="ค้นหาเบอร์โทรศัพท์บริษัท"
          searchValue={companySearchDraft}
          onSearchChange={setCompanySearchDraft}
          onSearchSubmit={() => setCompanySearch(companySearchDraft)}
          onExport={() => downloadCsv(buildCompanyDirectoryCsv(companyEntries), 'company-phone-directory.csv')}
          gridTemplateColumns={COMPANY_GRID_COLUMNS}
          columns={COMPANY_COLUMNS}
          rows={companyEntries}
          getRowKey={entry => entry.id}
          emptyMessage="ไม่พบข้อมูลที่ตรงกับเงื่อนไขที่เลือก"
          page={companyPage}
          pageCount={companyPageCount}
          totalCount={companyTotalCount}
          onPageChange={setCompanyPage}
        />

        <DirectoryCard
          title="เบอร์โทรศัพท์ภายในหรือโต๊ะทำงาน"
          toolbar={
            <>
              <Dropdown label="กรองตามแผนก" value={extensionFilters.department} options={departmentFilterOptions} onChange={setExtensionDepartment} />
              <Dropdown label="กรองตามสถานที่" value={extensionFilters.location} options={locationFilterOptions} onChange={setExtensionLocation} />
            </>
          }
          searchPlaceholder="ค้นหาเบอร์"
          searchAriaLabel="ค้นหาเบอร์โทรศัพท์ภายใน"
          searchValue={extensionSearchDraft}
          onSearchChange={setExtensionSearchDraft}
          onSearchSubmit={() => setExtensionSearch(extensionSearchDraft)}
          onExport={() => downloadCsv(buildExtensionDirectoryCsv(extensionEntries), 'internal-extension-directory.csv')}
          gridTemplateColumns={EXTENSION_GRID_COLUMNS}
          columns={EXTENSION_COLUMNS}
          rows={extensionEntries}
          getRowKey={entry => entry.id}
          emptyMessage="ไม่พบข้อมูลที่ตรงกับเงื่อนไขที่เลือก"
          page={extensionPage}
          pageCount={extensionPageCount}
          totalCount={extensionTotalCount}
          onPageChange={setExtensionPage}
        />
      </div>
    </div>
  );
}
