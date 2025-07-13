import { Routes } from '@angular/router';
import { AppLayoutComponent } from 'src/app/app-layout/app-layout.component';
import { AuthGuardChildFunction } from 'src/app/core/service/auth-guard.service';
import { LoginComponent } from 'src/app/login/login.component';

import { PostFormComponent } from './cooperation/board/post/post-form.component';
import { PostViewComponent } from './cooperation/board/post/post-view.component';
import { Oauth2LoginSuccessComponent } from './login/oauth2-login-success.component';

export const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login/:id', component: LoginComponent },
  {path: 'oauth2/:id', component: Oauth2LoginSuccessComponent },
  {path: 'login', component: LoginComponent },
  //{path: 'login2', component: Login2Component },

  //{path: 'home', component: AppLayoutComponent, canActivateChild: [AuthGuardService]},
  //{path: 'home', component: AppLayoutComponent, canActivateChild: [AuthGuardChildFunction]},
  {path: 'home', component: AppLayoutComponent},
  {path: 'system', loadChildren: () => import('src/app/system/system-management-routing.module').then(m => m.routes), data: {breadcrumb: 'system'}},
  {path: 'hrm', loadChildren: () => import('src/app/hrm/hrm-routing.module').then(m => m.routes)},
  {path: 'grw', loadChildren: () => import('src/app/cooperation/cooperation-routing.module').then(m => m.routes)},
  {path: 'profile', loadChildren: () => import('src/app/app-layout/app-layout.module').then(m => m.routes)},
  //{path: 'post-write/:boardId', component: PostFormComponent},
  //{path: 'post-edit/:boardId/:formDataId', component: PostFormComponent},
  //{path: 'post-view', component: PostViewComponent},
  {path: 'post-write/:boardId', loadComponent: () => import('src/app/cooperation/board//post/post-form.component').then(m => m.PostFormComponent)},
  {path: 'post-edit/:boardId/:formDataId', loadComponent: () => import('src/app/cooperation/board//post/post-form.component').then(m => m.PostFormComponent)},
  {path: 'post-view', loadComponent: () => import('src/app/cooperation/board//post/post-view.component').then(m => m.PostViewComponent)},
  {path: 'test', loadChildren: () => import('./pages/welcome/welcome-routing.module').then(m => m.routes)},
];
