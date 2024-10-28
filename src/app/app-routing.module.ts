import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AuthLoginGuard } from './guards/auth-login.guard';
import { AuthGuard } from './guards/auth.guard';
import { AdminComponent } from './modules/admin/admin.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: "login", 
    canActivate: [AuthLoginGuard], 
    component: LoginComponent
  },
  {path: "", redirectTo: '/login', pathMatch: 'full'},
  {
    path: "admin", 
    canActivate: [AuthGuard],
    loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule),
    component: AdminComponent
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
