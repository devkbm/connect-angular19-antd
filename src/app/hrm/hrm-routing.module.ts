import { Routes } from '@angular/router';

import { AppLayoutComponent } from '../app-layout/app-layout.component';
import { AuthGuardChildFunction, AuthGuardService } from '../core/service/auth-guard.service';

export const routes: Routes = [
  {
    path: '', component: AppLayoutComponent/*, canActivateChild: [AuthGuardService]*/,
    children: [
      {path: 'hrmtype',           loadComponent: () => import('./hrm-code/hrm-code.component').then(m => m.HrmCodeComponent)},
      {path: 'dutyapplication',   loadComponent: () => import('./attendance-application/attendance-application.component').then(m => m.AttendanceApplicationComponent)},
      {path: 'staff',             loadComponent: () => import('./staff/staff-management.component').then(m => m.StaffManagementComponent)}
    ]
  }
];
