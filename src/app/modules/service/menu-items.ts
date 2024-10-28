export type MenuItem = {
  icon: string;
  label: string;
  route?: string;
  permission?: string;
  subItems?: MenuItem[];
};

export const menuItem: MenuItem[] = [
  // {
  //   icon: 'admin_panel_settings',
  //   label: 'Admins',
  //   route: 'admins',
  //   permission: 'Admin Management',
  //   subItems: [
  //     {
  //       icon: 'person',
  //       label: 'Role',
  //       route: 'role',
  //     },
  //     {
  //       icon: 'person_search',
  //       label: 'Admin account',
  //       route: 'admin-account',
  //     },
  //   ],
  // },
  // {
  //   icon: 'admin_panel_settings',
  //   label: 'Admins',
  //   route: 'admins',
  //   permission: 'Role Management',
  //   subItems: [
  //     {
  //       icon: 'person',
  //       label: 'Role',
  //       route: 'role',
  //     },
  //   ],
  // },
  // {
  //   icon: 'remember_me',
  //   label: 'UI Management',
  //   route: 'ui-management',
  //   permission: 'Banner Management',
  //   subItems: [
  //     {
  //       icon: 'folder_managed',
  //       label: 'Banner Management',
  //       route: 'banner-managment',
  //     },
  //   ],
  // },
  // {
  //   icon: 'notifications',
  //   label: 'Notification',
  //   route: 'notification',
  //   permission: 'Notification Management',
  //   subItems: [
  //     {
  //       icon: 'favorite',
  //       label: 'Icon',
  //       route: 'icon',
  //     },
  //     {
  //       icon: 'sms',
  //       label: 'Notification',
  //       route: 'notification',
  //     },
  //     {
  //       icon: 'pending',
  //       label: 'Common Notification',
  //       route: 'common-notification',
  //     },
  //     {
  //       icon: 'history',
  //       label: 'History Notification',
  //       route: 'history-notification',
  //     },
  //   ],
  // },
  // {
  //   icon: 'group',
  //   label: 'Management Customer Account',
  //   route: 'management-customer',
  //   permission: 'Customer Management',
  // },
  // {
  //   icon: 'upload_file',
  //   label: 'Management Contract',
  //   route: 'management-contract',
  //   permission: 'Contract Management',
  //   subItems: [
  //     {
  //       icon: 'description',
  //       label: 'Request Contracts',
  //       route: 'request-contracts',
  //     },
  //     {
  //       icon: 'article',
  //       label: 'Contract List',
  //       route: 'contract-list',
  //     },
  //   ],
  // },
  {
    icon: 'local_shipping',
    label: 'Management Package',
    route: 'management-package',
    permission: 'Package Management',
  },
  // {
  //   icon: 'newspaper',
  //   label: 'Management News',
  //   route: 'management-news',
  //   permission: 'News Management',
  //   subItems: [
  //     {
  //       icon: 'newspaper',
  //       label: 'News',
  //       route: 'news',
  //     },
  //   ],
  // },
  // {
  //   icon: 'add_comment',
  //   label: 'Feedbacks & Suggestions',
  //   route: 'feedbacks-suggestions',
  //   permission: 'Feedback Management',
  //   subItems: [
  //     {
  //       icon: 'headphones',
  //       label: 'Contact Information',
  //       route: 'contact-information',
  //     },
  //     {
  //       icon: 'forum',
  //       label: 'User Feedbacks',
  //       route: 'user-feedback',
  //     },
  //   ],
  // },
];

export const buildMenuItems = (translations: any): MenuItem[] => [
  {
    icon: 'admin_panel_settings',
    label: translations.admins, // translated label
    route: 'admins',
    permission: 'Admin Management',
    subItems: [
      {
        icon: 'person',
        label: translations.role, // translated label
        route: 'role',
      },
      {
        icon: 'person_search',
        label: translations.adminAccount, // translated label
        route: 'admin-account',
      },
    ],
  },
  // {
  //   icon: 'admin_panel_settings',
  //   label: translations.admins, // translated label
  //   route: 'admins',
  //   permission: 'Role Management',
  //   subItems: [
  //     {
  //       icon: 'person',
  //       label: translations.role, // translated label
  //       route: 'role',
  //     },
  //   ],
  // },
  // {
  //   icon: 'remember_me',
  //   label: translations.uiManagement, // translated label
  //   route: 'ui-management',
  //   permission: 'Banner Management',
  //   subItems: [
  //     {
  //       icon: 'folder',
  //       label: translations.bannerManagement, // translated label
  //       route: 'banner-managment',
  //     },
  //   ],
  // },
  // {
  //   icon: 'notifications',
  //   label: translations.notification, // translated label
  //   route: 'notification',
  //   permission: 'Notification Management',
  //   subItems: [
  //     {
  //       icon: 'favorite',
  //       label: translations.icon, // translated label
  //       route: 'icon',
  //     },
  //     {
  //       icon: 'sms',
  //       label: translations.notification, // translated label
  //       route: 'notification',
  //     },
  //     {
  //       icon: 'pending',
  //       label: translations.commonNotification, // translated label
  //       route: 'common-notification',
  //     },
  //     {
  //       icon: 'history',
  //       label: translations.historyNotification, // translated label
  //       route: 'history-notification',
  //     },
  //   ],
  // },
  // {
  //   icon: 'group',
  //   label: translations.managementCustomerAccount, // translated label
  //   route: 'management-customer',
  //   permission: 'Customer Management',
  // },
  // {
  //   icon: 'upload_file',
  //   label: translations.managementContract, // translated label
  //   route: 'management-contract',
  //   permission: 'Contract Management',
  //   subItems: [
  //     {
  //       icon: 'description',
  //       label: translations.requestContracts, // translated label
  //       route: 'request-contracts',
  //     },
  //     {
  //       icon: 'article',
  //       label: translations.contractList, // translated label
  //       route: 'contract-list',
  //     },
  //   ],
  // },
  // {
  //   icon: 'local_shipping',
  //   label: translations.managementPackage, // translated label
  //   route: 'management-package',
  //   permission: 'Package Management',
  // },
  // {
  //   icon: 'newspaper',
  //   label: translations.managementNews, // translated label
  //   route: 'management-news',
  //   permission: 'News Management',
  //   subItems: [
  //     {
  //       icon: 'newspaper',
  //       label: translations.news, // translated label
  //       route: 'news',
  //     },
  //   ],
  // },
  // {
  //   icon: 'add_comment',
  //   label: translations.feedbackSuggestions, // translated label
  //   route: 'feedbacks-suggestions',
  //   permission: 'Feedback Management',
  //   subItems: [
  //     {
  //       icon: 'headphones',
  //       label: translations.contactInformation, // translated label
  //       route: 'contact-information',
  //     },
  //     {
  //       icon: 'forum',
  //       label: translations.userFeedbacks, // translated label
  //       route: 'user-feedback',
  //     },
  //   ],
  // },
];
