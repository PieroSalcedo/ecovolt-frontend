import { Routes } from '@angular/router';
import { PlanCatalogComponent } from './components/plan-catalog/plan-catalog.component';
import { LoginComponent } from './auth/login/login.component';

export const routes: Routes = [
  { path: '', component: PlanCatalogComponent },
  { path: 'planes', component: PlanCatalogComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];