import { Routes } from '@angular/router';
import { PlanCatalogComponent } from './components/plan-catalog/plan-catalog';
import { LoginComponent } from './auth/login/login';
import { ViviendaComponent } from './components/vivienda/vivienda';

export const routes: Routes = [
  // --- RUTAS PÚBLICAS ---
  { path: '', component: PlanCatalogComponent },
  { path: 'login', component: LoginComponent },
  { path: 'planes', redirectTo: '', pathMatch: 'full' },

  // --- TIPO 1: REGISTROS (Formularios) ---
  // Por ahora apuntan a ViviendaComponent hasta que crees los específicos
  { path: 'vivienda/registro', component: ViviendaComponent },
  { path: 'cuarto/registro', component: ViviendaComponent },
  { path: 'dispositivo/registro', component: ViviendaComponent },

  // --- TIPO 2: CONSULTAS ---
  { path: 'consulta/consumo', component: ViviendaComponent },
  { path: 'consulta/alertas', component: ViviendaComponent },

  // --- TIPO 3: MANTENIMIENTO (CRUD) ---
  { path: 'vivienda/mantenimiento', component: ViviendaComponent },
  { path: 'cuarto/mantenimiento', component: ViviendaComponent },
  { path: 'dispositivo/mantenimiento', component: ViviendaComponent },

  // --- TIPO 4: TRANSACCIONES ---
  { path: 'transaccion/plan', component: ViviendaComponent },

  // --- COMODÍN (SIEMPRE AL FINAL) ---
  { path: '**', redirectTo: '', pathMatch: 'full' }
];