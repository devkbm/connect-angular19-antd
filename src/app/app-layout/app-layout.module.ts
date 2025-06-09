import { Routes } from '@angular/router';

import { AppLayoutComponent } from '../app-layout/app-layout.component';

export const routes: Routes = [
  {
    path: '', component: AppLayoutComponent/*, canActivateChild: [AuthGuardService]*/,
    children: [
      {path: 'edit',             loadComponent: () => import('./user-profile/user-profile-form.component').then(m => m.UserProfileFormComponent)}
    ]
  }
];
