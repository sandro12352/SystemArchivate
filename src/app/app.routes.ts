import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout-component/auth-layout-component';
import { AUTH_ROUTES } from './features/auth/auth.routes';
import { MainLayoutComponent } from './layout/main-layout/main-layout-component/main-layout-component';
import { DASHBOARD_ROUTES } from './features/dashboard/dashboard.routes';
import { authUserGuard } from './core/guards/auth-user-guard';
import { AuthCallback } from './core/components/auth-callback/auth-callback';

export const routes: Routes = [
   {
      path: 'auth',
      component: AuthLayoutComponent,
      children: AUTH_ROUTES,
   },
   {
      path: 'home',
      component: MainLayoutComponent,
      children: DASHBOARD_ROUTES,
      canActivate: [authUserGuard]
   },
   {
      path: 'callback',
      component: AuthCallback
   },
   {
      path: '',
      redirectTo: 'auth/login',
      pathMatch: 'full'
   },
   {
      path: '**',
      redirectTo: 'auth/login',
      pathMatch: 'full'
   }
];
