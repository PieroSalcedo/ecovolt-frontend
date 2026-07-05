import { Routes } from '@angular/router';
import { PlanCatalogComponent } from './components/plan-catalog/plan-catalog';
import { LoginComponent } from './auth/login/login';
import { RegisterComponent } from './auth/register/register'; // <-- IMPORTANTE
import { RegistroVivienda } from './components/vivienda/registro-vivienda/registro-vivienda';
import { RegistroCuarto } from './components/cuarto/registro-cuarto/registro-cuarto';
import { RegistroDispositivo } from './components/dispositivo/registro-dispositivo/registro-dispositivo';
import { RegistroMeta } from './components/energia/registro-meta/registro-meta';
import { SimuladorLectura } from './components/energia/simulador-lectura/simulador-lectura';
import { ConsultaVivienda } from './components/vivienda/consulta-vivienda/consulta-vivienda';
import { ConsultaCuarto } from './components/cuarto/consulta-cuarto/consulta-cuarto';
import { ConsultaDispositivo } from './components/dispositivo/consulta-dispositivo/consulta-dispositivo';
import { DashboardAhorro } from './components/energia/dashboard-ahorro/dashboard-ahorro';
import { ReporteConsumo } from './components/reporte/reporte-consumo/reporte-consumo';

// ... (Resto de imports de Vivienda, Cuarto, Dispositivo, etc.)

export const routes: Routes = [
  { path: '', component: PlanCatalogComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent }, // <-- RUTA DE REGISTRO

  // BLOQUE REGISTROS
  { path: 'vivienda/registro', component: RegistroVivienda },
  { path: 'cuarto/registro', component: RegistroCuarto },
  { path: 'dispositivo/registro', component: RegistroDispositivo },
  { path: 'energia/meta', component: RegistroMeta },
  { path: 'energia/simulador', component: SimuladorLectura },

  // BLOQUE CONSULTAS
  { path: 'vivienda/mantenimiento', component: ConsultaVivienda },
  { path: 'cuarto/mantenimiento', component: ConsultaCuarto },
  { path: 'dispositivo/mantenimiento', component: ConsultaDispositivo },
  { path: 'energia/dashboard', component: DashboardAhorro },
  { path: 'reporte/consumo', component: ReporteConsumo },

  { path: 'planes', redirectTo: '', pathMatch: 'full' },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];