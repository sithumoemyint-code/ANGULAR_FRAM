import { Routes, Route } from '@angular/router';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { StatisticComponent } from './pages/statistic/statistic.component';
import { CustomerComponent } from './pages/customer/customer.component';
import { StatisticChildComponent } from './pages/statistic/components/statistic-child/statistic-child.component';
import { CustomerChildComponent } from './pages/customer/components/customer-child/customer-child.component';

// Define CustomRoute without redeclaring pathMatch
interface CustomRoute extends Omit<Route, 'children'> {
  path: string;
  component?: any;
  redirectTo?: string;
  children?: CustomRoute[]; // Nested children use CustomRoute type
}

export function generateRoutes(): Routes {
  const routeRawArray: Routes = [
    {
      path: '',
      component: StatisticComponent,
      children: [
        {
          path: '',
          pathMatch: 'full' as const, // Ensuring TypeScript recognizes this as literal "full"
          redirectTo: 'app-statistic',
        },
        {
          path: 'app-statistic',
          component: StatisticChildComponent,
        },
      ],
    },
    {
      path: '',
      component: CustomerComponent,
      children: [
        {
          path: '',
          pathMatch: 'full' as const,
          redirectTo: 'app-customer',
        },
        {
          path: 'app-customer',
          component: CustomerChildComponent,
        },
      ],
    },
  ];

  const finalResult: Routes = [
    ...routeRawArray,
    {
      path: '**',
      component: PageNotFoundComponent,
    },
  ];

  return finalResult;
}
