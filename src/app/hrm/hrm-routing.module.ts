import { Routes } from '@angular/router';

import { AppLayoutComponent } from '../app-layout/app-layout.component';
import { AuthGuardChildFunction, AuthGuardService } from '../core/service/auth-guard.service';
import { ConfigOption, FormlyModule } from '@ngx-formly/core';
import { EnvironmentProviders, importProvidersFrom } from '@angular/core';

export const provideFormlyConfig = (config: ConfigOption): EnvironmentProviders => importProvidersFrom([
  FormlyModule.forChild(config),
]);

export const routes: Routes = [
  {
    path: '', component: AppLayoutComponent/*, canActivateChild: [AuthGuardService]*/,
    children: [
      {path: 'hrmtype',           loadComponent: () => import('./hrm-code/hrm-code.component').then(m => m.HrmCodeComponent), providers: [provideFormlyConfig({})]},
      {path: 'dutyapplication',   loadComponent: () => import('./attendance-application/attendance-application.component').then(m => m.AttendanceApplicationComponent)},
      {path: 'staff',             loadComponent: () => import('./staff/staff-management.component').then(m => m.StaffManagementComponent)}
    ]
  }
];
