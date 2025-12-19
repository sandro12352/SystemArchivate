import { Routes } from '@angular/router';
import { clientProfilentGuard } from '../../core/guards/client-profilent-guard';

export const AUTH_ROUTES: Routes = [ 
  {
    path: 'login',
    loadComponent: () => import('./pages/login-component/login-component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register-component/register-component').then(m => m.RegisterComponent)
  },
  {
    path:'recover',
    loadComponent:()=>import('./pages/recover-component/recover-component').then(m=>m.RecoverComponent),
  },{
    path:'callback',
    loadComponent:()=>import('../../core/components/auth-callback/auth-callback').then(m=>m.AuthCallback),
    canActivate:[clientProfilentGuard]
  },
  {
    path:'update-password',
    loadComponent:()=>import('./pages/update-password-compenent/update-password-compenent').then(m=>m.UpdatePasswordCompenent),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }

];
