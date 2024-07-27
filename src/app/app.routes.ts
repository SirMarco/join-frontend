import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { SummaryComponent } from './summary/summary.component';
import { BoardComponent } from './board/board.component';
import { AddTaskComponent } from './add-task/add-task.component';
import { ContactsComponent } from './contacts/contacts.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: SummaryComponent, canActivate: [AuthGuard] },
      {
        path: 'summary',
        component: SummaryComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'addTask',
        component: AddTaskComponent,
        canActivate: [AuthGuard],
      },
      { path: 'board', component: BoardComponent, canActivate: [AuthGuard] },
      {
        path: 'contacts',
        component: ContactsComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
    ],
  },
];
