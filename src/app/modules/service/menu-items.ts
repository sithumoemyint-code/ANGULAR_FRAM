export type MenuItem = {
  icon: string;
  label: string;
  route?: string;
  permission?: string;
  subItems?: MenuItem[];
};

export const menuItem: MenuItem[] = [
  {
    icon: 'query_stats',
    label: 'Statistic',
    route: 'app-statistic',
  },
  {
    icon: 'account_circle',
    label: 'Customer',
    route: 'app-customer',
  },
  {
    icon: 'folder_open',
    label: 'Import Data',
    route: 'app-import-data',
  },
];
