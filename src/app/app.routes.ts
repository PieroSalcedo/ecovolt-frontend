import { Routes } from '@angular/router';
import { PlanCatalogComponent } from './components/plan-catalog/plan-catalog';
import { LoginComponent } from './auth/login/login';

export const routes: Routes = [
  { path: '', component: PlanCatalogComponent },
  { path: 'planes', component: PlanCatalogComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];