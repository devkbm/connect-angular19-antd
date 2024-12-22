import { Routes } from '@angular/router';

import { AppLayoutComponent } from '../app-layout/app-layout.component';

import { AuthGuardService } from '../core/service/auth-guard.service';

export const routes: Routes = [
  {
    path: '', component: AppLayoutComponent, //canActivateChild: [AuthGuardService],
    children: [
      {path: 'company',       loadComponent: () => import('./company/company.component').then(m => m.CompanyComponent)},
      {path: 'user',          loadComponent: () => import('./user/user.component').then(m => m.UserComponent), data: {breadcrumb: 'user'}},
      {path: 'role',          loadComponent: () => import('./role/role.component').then(m => m.RoleComponent)},
      {path: 'menu',          loadComponent: () => import('./menu/menu.component').then(m => m.MenuComponent)},
      {path: 'menu-role',     loadComponent: () => import('./menu-role/menu-role.component').then(m => m.MenuRoleComponent)},
      {path: 'webresource',   loadComponent: () => import('./webresource/web-resource.component').then(m => m.WebResourceComponent)},
      {path: 'commoncode',    loadComponent: () => import('./commoncode/common-code.component').then(m => m.CommonCodeComponent)},
      {path: 'dept',          loadComponent: () => import('./dept/dept.component').then(m => m.DeptComponent)},
      {path: 'term',          loadComponent: () => import('./terms/term.component').then(m => m.TermComponent)},
      {path: 'holiday',       loadComponent: () => import('./holiday/holiday.component').then(m => m.HolidayComponent)},
      {path: 'bizcode',       loadComponent: () => import('./biz-code/biz-code.component').then(m => m.BizCodeComponent)}
    ]
  }
];
