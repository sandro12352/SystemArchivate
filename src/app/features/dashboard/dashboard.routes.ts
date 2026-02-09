import { Routes } from '@angular/router';
import { tasksApprovedGuard } from '../../core/guards/tasks-approved-guard';

export const DASHBOARD_ROUTES: Routes = [ 
  {
    path:'dashboard',
    loadComponent:()=>import('./pages/dashboard-home-component/dashboard-home-component').then(m=>m.DashboardHomeComponent),
  },
  {
    path:'activate',
    loadComponent:()=>import('./pages/activate-component/activate-component').then(m=>m.ActivateComponent),
    canActivate:[tasksApprovedGuard],
  }

];
