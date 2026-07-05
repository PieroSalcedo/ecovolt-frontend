import { Routes } from '@angular/router';
import { PlanCatalogComponent } from './components/plan-catalog/plan-catalog';
import { LoginComponent } from './auth/login/login';
import { RegistroVivienda } from './components/vivienda/registro-vivienda/registro-vivienda';
import { ConsultaVivienda } from './components/vivienda/consulta-vivienda/consulta-vivienda';
import { RegistroCuarto } from './components/cuarto/registro-cuarto/registro-cuarto';
import { ConsultaCuarto } from './components/cuarto/consulta-cuarto/consulta-cuarto';
import { ConsultaDispositivo } from './components/dispositivo/consulta-dispositivo/consulta-dispositivo';
import { RegistroDispositivo } from './components/dispositivo/registro-dispositivo/registro-dispositivo';
import { SmartAdvisor } from './components/advisor/smart-advisor/smart-advisor';
import { RegistroMeta } from './components/energia/registro-meta/registro-meta';
import { DashboardAhorro } from './components/energia/dashboard-ahorro/dashboard-ahorro';

export const routes: Routes = [
  { path: '', component: PlanCatalogComponent },

  { path: 'login', component: LoginComponent },

  { path: 'vivienda/registro', component: RegistroVivienda },
  { path: 'vivienda/mantenimiento', component: ConsultaVivienda },

  { path: 'cuarto/registro', component: RegistroCuarto },
  { path: 'cuarto/mantenimiento', component: ConsultaCuarto },

  { path: 'dispositivo/registro', component: RegistroDispositivo },
  { path: 'dispositivo/mantenimiento', component: ConsultaDispositivo },

  { path: 'advisor/smart', component: SmartAdvisor },

  { path: 'energia/meta', component: RegistroMeta },
  { path: 'energia/dashboard', component: DashboardAhorro },

  { path: 'planes', redirectTo: '', pathMatch: 'full' },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
