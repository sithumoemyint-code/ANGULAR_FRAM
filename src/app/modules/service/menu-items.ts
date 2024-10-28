export type MenuItem = {
  icon: string;
  label: string;
  route?: string;
  permission?: string;
  subItems?: MenuItem[];
};

export const menuItem: MenuItem[] = [
  {
    icon: 'newspaper',
    label: 'Statistic',
    route: 'app-statistic',
  },
  {
    icon: 'newspaper',
    label: 'Customer',
    route: 'app-customer',
  },
  {
    icon: 'newspaper',
    label: 'Import Data',
    route: 'app-import-data',
  },
];
