
import { Routes } from '@angular/router';

import { AppLayoutComponent } from '../app-layout/app-layout.component';

import { AuthGuardService } from '../core/service/auth-guard.service';

export const routes: Routes = [
  {
    path: '', component: AppLayoutComponent/*, canActivateChild: [AuthGuardService]*/,
    children: [
      {path: 'team',          loadComponent: () => import('./team/team-app').then(m => m.TeamApp)},
      {path: 'board',         loadComponent: () => import('./board/board-app').then(m => m.BoardApp)},
      {path: 'boardm',        loadComponent: () => import('./board/board-management/board-management-app').then(m => m.BoardManagementApp)},
      {path: 'todo',          loadComponent: () => import('./todo/todo-app').then(m => m.TodoApp)},
      {path: 'workcalendar',  loadComponent: () => import('./work-calendar/work-calendar-app').then(m => m.WorkCalendarApp)}
    ]
  }
];
