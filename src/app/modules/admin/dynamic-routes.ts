import { Routes, Route } from '@angular/router';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { StatisticComponent } from './pages/statistic/statistic.component';
import { CustomerComponent } from './pages/customer/customer.component';
import { ImportDataComponent } from './pages/import-data/import-data.component';
import { StatisticChildComponent } from './pages/statistic/components/statistic-child/statistic-child.component';
import { CustomerChildComponent } from './pages/customer/components/customer-child/customer-child.component';
import { ImportDataChildComponent } from './pages/import-data/components/import-data-child/import-data-child.component';

// Define CustomRoute without redeclaring pathMatch
interface CustomRoute extends Omit<Route, 'children'> {
  path: string;
  component?: any;
  redirectTo?: string;
  children?: CustomRoute[]; // Nested children use CustomRoute type
}

// Define routeRawArray using CustomRoute
const routeRawArray: CustomRoute[] = [
  {
    path: '',
    component: StatisticComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'app-statistic'
      },
      {
        path: 'app-statistic',
        component: StatisticChildComponent,
      }
    ]
  },
  {
    path: '',
    component: CustomerComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'app-customer'
      },
      {
        path: 'app-customer',
        component: CustomerChildComponent
      }
    ]
  },
  {
    path: '',
    component: ImportDataComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'app-import-data'
      },
      {
        path: 'app-import-data',
        component: ImportDataChildComponent
      }
    ]
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

  return finalResult;
}
