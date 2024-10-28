import { Routes } from '@angular/router';
import { AdminComponent } from './pages/admin/admin.component';
import { UiManagementComponent } from './pages/ui-management/ui-management.component';
import { BannerManagmentComponent } from './pages/ui-management/components/banner-managment/banner-managment.component';
import { NotificationComponent } from './pages/notification/notification.component';
import { NotificationChildComponent } from './pages/notification/components/notification/notification.component';
import { IconComponent } from './pages/notification/components/icon/icon.component';
import { CommonNotificationComponent } from './pages/notification/components/common-notification/common-notification.component';
import { HistoryNotificationComponent } from './pages/notification/components/history-notification/history-notification.component';
import { ManagementContractComponent } from './pages/management-contract/management-contract.component';
import { ManagementPackageComponent } from './pages/management-package/management-package.component';
import { ManagementNewsComponent } from './pages/management-news/management-news.component';
import { FeedbackComponent } from './pages/feedback/feedback.component';
import { NewsComponent } from './pages/management-news/news/news.component';
import { CreateBannerComponent } from './pages/ui-management/components/banner-managment/create-banner/create-banner.component';
import { ContactInformationComponent } from './pages/feedback/components/contact-information/contact-information.component';
import { UserFeedbacksComponent } from './pages/feedback/components/user-feedbacks/user-feedbacks.component';
import { RequestContractsComponent } from './pages/management-contract/request-contracts/request-contracts.component';
import { ContractListComponent } from './pages/management-contract/contract-list/contract-list.component';
import { RoleComponent } from './pages/admin/components/role/role.component';
import { AdminAccountComponent } from './pages/admin/components/admin-account/admin-account.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { AccountDetailComponent } from './pages/customer-management/components/account-detail/account-detail.component';
import { CustomerManagementComponent } from './pages/customer-management/customer-management.component';
import { ManagementCustomerComponent } from './pages/customer-management/components/management-customer/management-customer.component';
import { getCookie } from '../service/get-group-cookie';
import { menuItem } from '../service/menu-items';

const routeRawArray = [
  // {
  //   path: 'admins',
  //   component: AdminComponent,
  //   children: [
  //     {
  //       path: '',
  //       pathMatch: 'full',
  //       redirectTo: 'role',
  //     },
  //     {
  //       path: 'role',
  //       component: RoleComponent,
  //     },
  // {
  //   path: 'admin-account',
  //   component: AdminAccountComponent,
  // },
  // ],
  // },
  // {
  //   path: 'ui-management',
  //   component: UiManagementComponent,
  //   children: [
  //     {
  //       path: '',
  //       pathMatch: 'full',
  //       redirectTo: 'banner-managment',
  //     },
  //     {
  //       path: 'banner-managment',
  //       component: BannerManagmentComponent,
  //     },
  //     {
  //       path: 'create-banner-management',
  //       component: CreateBannerComponent,
  //     },
  //   ],
  // },
  // {
  //   path: 'notification',
  //   component: NotificationComponent,
  //   children: [
  //     {
  //       path: '',
  //       pathMatch: 'full',
  //       redirectTo: 'icon',
  //     },
  //     {
  //       path: 'icon',
  //       component: IconComponent,
  //     },
  //     {
  //       path: 'notification',
  //       component: NotificationChildComponent,
  //     },
  //     {
  //       path: 'common-notification',
  //       component: CommonNotificationComponent,
  //     },
  //     {
  //       path: 'history-notification',
  //       component: HistoryNotificationComponent,
  //     },
  //   ],
  // },
  // {
  //   path: 'management-customer',
  //   component: CustomerManagementComponent,
  //   children: [
  //     {
  //       path: '',
  //       pathMatch: 'full',
  //       redirectTo: 'customer-account',
  //     },
  //     {
  //       path: 'customer-account',
  //       component: ManagementCustomerComponent,
  //     },
  //     {
  //       path: 'account-detail',
  //       component: AccountDetailComponent,
  //     },
  //   ],
  // },
  // {
  //   path: 'management-contract',
  //   component: ManagementContractComponent,
  //   children: [
  //     {
  //       path: '',
  //       pathMatch: 'full',
  //       redirectTo: 'request-contracts',
  //     },
  //     {
  //       path: 'request-contracts',
  //       component: RequestContractsComponent,
  //     },
  //     {
  //       path: 'contract-list',
  //       component: ContractListComponent,
  //     },
  //   ],
  // },
  {
    path: 'management-package',
    component: ManagementPackageComponent,
  },
  // {
  //   path: 'management-news',
  //   component: ManagementNewsComponent,
  //   children: [
  //     {
  //       path: '',
  //       pathMatch: 'full',
  //       redirectTo: 'news',
  //     },
  //     {
  //       path: 'news',
  //       component: NewsComponent,
  //     },
  //   ],
  // },
  // {
  //   path: 'feedbacks-suggestions',
  //   component: FeedbackComponent,
  //   children: [
  //     {
  //       path: '',
  //       pathMatch: 'full',
  //       redirectTo: 'contact-information',
  //     },
  //     {
  //       path: 'contact-information',
  //       component: ContactInformationComponent,
  //     },
  //     {
  //       path: 'user-feedback',
  //       component: UserFeedbacksComponent,
  //     },
  //   ],
  // },
];

export function generateRoutes(): Routes {
  // const groupPermission = getCookie('groupPermission');

  // const hasAdminManagement = groupPermission.some(
  //   (item: any) => item.name === 'Admin Management'
  // );

  // const updatedGroupPermission = hasAdminManagement
  //   ? groupPermission.filter((item: any) => item.name !== 'Role Management')
  //   : groupPermission;

  // const groupPermissionMenu = menuItem.filter((menuItem: any) =>
  //   updatedGroupPermission.some(
  //     (permissionItem: any) => permissionItem.name === menuItem.permission
  //   )
  // );

  // const finalArray: any[] = routeRawArray.filter((item: any) =>
  //   groupPermissionMenu.some(
  //     (arrPermission: any) => arrPermission.route === item.path
  //   )
  // );

  const finalResult: Routes = [
    // {
    //   path: '',
    //   pathMatch: 'full',
    //   redirectTo: finalArray[0]?.path || 'admins',
    // },
    ...routeRawArray,
    {
      path: '**',
      component: PageNotFoundComponent,
    },
  ];

  const arr: Routes = finalResult;

  return arr;
}
