import { Routes } from '@angular/router';
import { PlanCatalogComponent } from './components/plan-catalog/plan-catalog';
import { LoginComponent } from './auth/login/login';

export const routes: Routes = [
  { path: '', component: PlanCatalogComponent }, // Ruta raíz
  { path: 'login', component: LoginComponent },
  { path: 'planes', redirectTo: '', pathMatch: 'full' }, // Si alguien va a /planes, lo manda a la raíz
  { path: '**', redirectTo: '', pathMatch: 'full' }
];