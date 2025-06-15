import { Routes } from '@angular/router';

import { AppLayoutComponent } from '../app-layout/app-layout.component';

import { AuthGuardService } from '../core/service/auth-guard.service';

export const routes: Routes = [
  {
    path: '', component: AppLayoutComponent, //canActivateChild: [AuthGuardService],
    children: [
      {path: 'company',       loadComponent: () => import('./company/company-app').then(m => m.CompanyApp)},
      {path: 'user',          loadComponent: () => import('./user/user-app').then(m => m.UserApp), data: {breadcrumb: 'user'}},
      {path: 'role',          loadComponent: () => import('./role/role-app').then(m => m.RoleApp)},
      {path: 'menu',          loadComponent: () => import('./menu/menu-app').then(m => m.MenuApp)},
      {path: 'menu-role',     loadComponent: () => import('./menu-role/menu-role-app').then(m => m.MenuRoleApp)},
      {path: 'webresource',   loadComponent: () => import('./webresource/web-resource-app').then(m => m.WebResourceApp)},
      {path: 'commoncode',    loadComponent: () => import('./commoncode/common-code-app').then(m => m.CommonCodeApp)},
      {path: 'dept',          loadComponent: () => import('./dept/dept-app').then(m => m.DeptApp)},
      {path: 'term',          loadComponent: () => import('./terms/term-app').then(m => m.TermApp)},
      {path: 'holiday',       loadComponent: () => import('./holiday/holiday-app').then(m => m.HolidayApp)},
      {path: 'bizcode',       loadComponent: () => import('./biz-code/biz-code-app').then(m => m.BizCodeApp)}
    ]
  }
];
