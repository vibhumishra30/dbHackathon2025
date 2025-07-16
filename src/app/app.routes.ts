import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import {
  AuthPipeGenerator,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/compat/auth-guard';
import { AuthGuard } from '@angular/fire/auth-guard';

const redirectUnauthorizedPipeGenerator: AuthPipeGenerator = () =>
  redirectUnauthorizedTo(['/login']);
const redirectLoggedInPipeGenerator: AuthPipeGenerator = () => redirectLoggedInTo(['/']);

export const appRoutes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./feature/login/login.component').then((m) => m.LoginComponent),
        // canActivate: [AuthGuard],
        data: {
          authGuardPipe: redirectLoggedInPipeGenerator,
        },
      },
      {
        path: '',
        // pathMatch: 'full',
        loadComponent: () =>
          import('./feature/shell/shell.component').then((m) => m.ShellComponent),
        // canActivate: [AuthGuard],
        data: {
          authGuardPipe: redirectUnauthorizedPipeGenerator,
        },
        children: [
          {
            path: 'finance-guru',
            pathMatch: 'full',
            loadComponent: () =>
              import('./feature/finance-guru/finance-guru.component').then((m) => m.FinanceGuruComponent),
          },
        ],
        
      },
    ],
  },
];
