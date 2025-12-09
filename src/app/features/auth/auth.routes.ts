import { Routes } from '@angular/router';

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
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }

];
