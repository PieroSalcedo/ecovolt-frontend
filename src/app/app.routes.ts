import { Routes } from '@angular/router';
import { PlanCatalogComponent } from './components/plan-catalog/plan-catalog';
import { LoginComponent } from './auth/login/login';

// 1. IMPORTA TUS NUEVOS COMPONENTES (Asegúrate de que las rutas coincidan con tus archivos)
import { RegistroVivienda } from './components/vivienda/registro-vivienda/registro-vivienda';
import { ConsultaVivienda } from './components/vivienda/consulta-vivienda/consulta-vivienda';
import { RegistroCuarto } from './components/cuarto/registro-cuarto/registro-cuarto';
import { ConsultaCuarto } from './components/cuarto/consulta-cuarto/consulta-cuarto';
import { ConsultaDispositivo } from './components/dispositivo/consulta-dispositivo/consulta-dispositivo';
import { RegistroDispositivo } from './components/dispositivo/registro-dispositivo/registro-dispositivo';
import { RegistroMeta } from './components/energia/registro-meta/registro-meta';
import { DashboardAhorro } from './components/energia/dashboard-ahorro/dashboard-ahorro';

export const routes: Routes = [
  // --- RUTA RAÍZ ---
  { path: '', component: PlanCatalogComponent }, 

  // --- LOGIN ---
  { path: 'login', component: LoginComponent },

  // --- VIVIENDAS ---
  { path: 'vivienda/registro', component: RegistroVivienda },
  { path: 'vivienda/mantenimiento', component: ConsultaVivienda },

  // --- CUARTOS ---
  { path: 'cuarto/registro', component: RegistroCuarto },
  { path: 'cuarto/mantenimiento', component: ConsultaCuarto },

  // --- DISPOSITIVOS ---
  { path: 'dispositivo/registro', component: RegistroDispositivo },
  { path: 'dispositivo/mantenimiento', component: ConsultaDispositivo },

  // --- ENERGÍA ---
  { path: 'energia/meta', component: RegistroMeta },
{ path: 'energia/dashboard', component: DashboardAhorro },

  // --- REDIRECCIONES ---
  { path: 'planes', redirectTo: '', pathMatch: 'full' },
  
  // COMODÍN (Si la ruta no existe, manda al catálogo)
  { path: '**', redirectTo: '', pathMatch: 'full' }
];