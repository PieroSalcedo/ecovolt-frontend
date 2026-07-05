import { Routes } from '@angular/router';
import { PlanCatalogComponent } from './components/plan-catalog/plan-catalog';
import { LoginComponent } from './auth/login/login';

// VIVIENDAS
import { RegistroVivienda } from './components/vivienda/registro-vivienda/registro-vivienda';
import { ConsultaVivienda } from './components/vivienda/consulta-vivienda/consulta-vivienda';

// CUARTOS
import { RegistroCuarto } from './components/cuarto/registro-cuarto/registro-cuarto';
import { ConsultaCuarto } from './components/cuarto/consulta-cuarto/consulta-cuarto';

// ENERGÍA (METAS Y SIMULADOR)
import { RegistroMeta } from './components/energia/registro-meta/registro-meta';
import { DashboardAhorro } from './components/energia/dashboard-ahorro/dashboard-ahorro';
import { SimuladorLectura } from './components/energia/simulador-lectura/simulador-lectura';

// REPORTES (EL CEREBRO ANALÍTICO)
import { ReporteConsumo } from './components/reporte/reporte-consumo/reporte-consumo';

export const routes: Routes = [
  // --- PÚBLICAS ---
  { path: '', component: PlanCatalogComponent },
  { path: 'login', component: LoginComponent },

  // --- REGISTROS (Tipo 1) ---
  { path: 'vivienda/registro', component: RegistroVivienda },
  { path: 'cuarto/registro', component: RegistroCuarto },
  { path: 'energia/meta', component: RegistroMeta },
  { path: 'energia/simulador', component: SimuladorLectura },

  // --- CONSULTAS Y MANTENIMIENTO (Tipo 2 y 3) ---
  { path: 'vivienda/mantenimiento', component: ConsultaVivienda },
  { path: 'cuarto/mantenimiento', component: ConsultaCuarto },
  { path: 'energia/dashboard', component: DashboardAhorro },
  
  // RUTA DE REPORTES (Debe coincidir con el route de la BD)
  { path: 'reporte/consumo', component: ReporteConsumo },

  // --- REDIRECCIONES ---
  { path: 'planes', redirectTo: '', pathMatch: 'full' },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];