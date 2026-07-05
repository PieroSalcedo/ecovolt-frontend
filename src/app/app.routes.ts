import { Routes } from '@angular/router';

// PÚBLICAS Y SEGURIDAD
import { PlanCatalogComponent } from './components/plan-catalog/plan-catalog';
import { LoginComponent } from './auth/login/login';

// VIVIENDAS
import { RegistroVivienda } from './components/vivienda/registro-vivienda/registro-vivienda';
import { ConsultaVivienda } from './components/vivienda/consulta-vivienda/consulta-vivienda';

// CUARTOS (AMBIENTES)
import { RegistroCuarto } from './components/cuarto/registro-cuarto/registro-cuarto';
import { ConsultaCuarto } from './components/cuarto/consulta-cuarto/consulta-cuarto';

// DISPOSITIVOS (IOT)
import { RegistroDispositivo } from './components/dispositivo/registro-dispositivo/registro-dispositivo';
import { ConsultaDispositivo } from './components/dispositivo/consulta-dispositivo/consulta-dispositivo';

// ENERGÍA (METAS Y SIMULADOR)
import { RegistroMeta } from './components/energia/registro-meta/registro-meta';
import { DashboardAhorro } from './components/energia/dashboard-ahorro/dashboard-ahorro';
import { SimuladorLectura } from './components/energia/simulador-lectura/simulador-lectura';

// REPORTES (DASHBOARD DINÁMICO)
import { ReporteConsumo } from './components/reporte/reporte-consumo/reporte-consumo';

export const routes: Routes = [
  // --- BLOQUE PÚBLICO ---
  { path: '', component: PlanCatalogComponent },
  { path: 'login', component: LoginComponent },

  // --- BLOQUE TIPO 1: REGISTROS (Formularios) ---
  { path: 'vivienda/registro', component: RegistroVivienda },
  { path: 'cuarto/registro', component: RegistroCuarto },
  { path: 'dispositivo/registro', component: RegistroDispositivo },
  { path: 'energia/meta', component: RegistroMeta },
  { path: 'energia/simulador', component: SimuladorLectura },

  // --- BLOQUE TIPO 2 Y 3: CONSULTAS Y MANTENIMIENTO (Tablas) ---
  { path: 'vivienda/mantenimiento', component: ConsultaVivienda },
  { path: 'cuarto/mantenimiento', component: ConsultaCuarto },
  { path: 'dispositivo/mantenimiento', component: ConsultaDispositivo },
  { path: 'energia/dashboard', component: DashboardAhorro }, // Monitor de Ahorro (Barra)
  { path: 'reporte/consumo', component: ReporteConsumo },      // Dashboard de Consumo (Gráficos)

  // --- REDIRECCIONES Y COMODINES ---
  { path: 'planes', redirectTo: '', pathMatch: 'full' },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];