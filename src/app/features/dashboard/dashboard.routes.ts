import { Routes } from '@angular/router';
import { tasksApprovedGuard } from '../../core/guards/tasks-approved-guard';
import { isApprovedGuard } from '../../core/guards/is-approved-guard';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard-home-component/dashboard-home-component').then(m => m.DashboardHomeComponent),
    canActivate: [isApprovedGuard]
  },
  {
    path: 'activate',
    loadComponent: () => import('./pages/activate-component/activate-component').then(m => m.ActivateComponent),
    canActivate: [tasksApprovedGuard],
  },
  {
    path: 'contratos',
    loadComponent: () => import('../contracts/pages/contracts-list/contracts-list-component').then(m => m.ContractsListComponent),
    canActivate: [isApprovedGuard]
  },
  {
    path: 'contratos/visor',
    loadComponent: () => import('../contracts/pages/contract-viewer/contract-viewer.component').then(m => m.ContractViewerComponent),
    canActivate: [isApprovedGuard]
  }
];
