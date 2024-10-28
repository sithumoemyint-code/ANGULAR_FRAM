import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { StatisticComponent } from './pages/statistic/statistic.component';
import { CustomerComponent } from './pages/customer/customer.component';
import { ImportDataComponent } from './pages/import-data/import-data.component';

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
  {
    path: 'app-statistic',
    component: StatisticComponent,
  },
  {
    path: 'app-customer',
    component: CustomerComponent,
  },
  {
    path: 'app-import-data',
    component: ImportDataComponent,
  },
];

export function generateRoutes(): Routes {
  const finalResult: Routes = [
    ...routeRawArray,
    {
      path: '**',
      component: PageNotFoundComponent,
    },
  ];

  const arr: Routes = finalResult;

  return arr;
}
