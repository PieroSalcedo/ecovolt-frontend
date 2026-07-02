import { Routes } from '@angular/router';
import { PlanCatalogComponent } from './components/plan-catalog/plan-catalog';
import { LoginComponent } from './auth/login/login';
import { ViviendaComponent } from './components/vivienda/vivienda';

export const routes: Routes = [
  { path: '', component: PlanCatalogComponent },
  { path: 'login', component: LoginComponent },
  { path: 'planes', redirectTo: '', pathMatch: 'full' },
  { path: 'customer/homes', component: ViviendaComponent }, // <--- DEBE ESTAR ANTES DEL **
  { path: '**', redirectTo: '', pathMatch: 'full' }          // <--- ESTE SIEMPRE AL FINAL
];