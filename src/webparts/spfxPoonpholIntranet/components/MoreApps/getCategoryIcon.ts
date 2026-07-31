import humanResourcesIcon from '../../assets/more-apps/icons/human-resources.svg';
import exportIcon from '../../assets/more-apps/icons/export.svg';
import accountingIcon from '../../assets/more-apps/icons/accounting.svg';
import officeIcon from '../../assets/more-apps/icons/office.svg';
import businessIcon from '../../assets/more-apps/icons/business.svg';
import dtIcon from '../../assets/more-apps/icons/dt.svg';

const CATEGORY_ICONS: string[] = [humanResourcesIcon, exportIcon, accountingIcon, officeIcon, businessIcon, dtIcon];

export function getCategoryIcon(categoryId: string): string {
  const hash = Array.from(categoryId).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return CATEGORY_ICONS[hash % CATEGORY_ICONS.length];
}
