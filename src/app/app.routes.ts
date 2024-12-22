import { Routes } from '@angular/router';
import { AppLayoutComponent } from 'src/app/app-layout/app-layout.component';
import { AuthGuardChildFunction } from 'src/app/core/service/auth-guard.service';
import { LoginComponent } from 'src/app/login/login.component';

import { ArticleFormComponent } from './cooperation/board/article/article-form.component';
import { ArticleViewComponent } from './cooperation/board/article/article-view.component';
import { Oauth2LoginSuccessComponent } from './login/oauth2-login-success.component';

export const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login/:id', component: LoginComponent },
  {path: 'oauth2/:id', component: Oauth2LoginSuccessComponent },
  {path: 'login', component: LoginComponent },
  //{path: 'login2', component: Login2Component },

  //{path: 'home', component: AppLayoutComponent, canActivateChild: [AuthGuardService]},
  {path: 'home', component: AppLayoutComponent, canActivateChild: [AuthGuardChildFunction]},
  {path: 'system', data: {breadcrumb: 'system'}, loadChildren: () => import('src/app/system/system-management-routing.module').then(m => m.routes)},
  {path: 'hrm', loadChildren: () => import('src/app/hrm/hrm-routing.module').then(m => m.routes)},
  {path: 'grw', loadChildren: () => import('src/app/cooperation/cooperation-routing.module').then(m => m.routes)},
  {path: 'article-write/:boardId', component: ArticleFormComponent},
  {path: 'article-edit/:boardId/:initLoadId', component: ArticleFormComponent},
  {path: 'article-view', component: ArticleViewComponent},
  {path: 'test', loadChildren: () => import('./pages/welcome/welcome-routing.module').then(m => m.routes)},
];
