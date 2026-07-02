import { Routes } from '@angular/router';
import { PlanCatalogComponent } from './components/plan-catalog/plan-catalog';
import { LoginComponent } from './auth/login/login';

// 1. IMPORTA TUS NUEVOS COMPONENTES (Asegúrate de que las rutas coincidan con tus archivos)
import { RegistroVivienda } from './components/vivienda/registro-vivienda/registro-vivienda';
import { ConsultaVivienda } from './components/vivienda/consulta-vivienda/consulta-vivienda';

export const routes: Routes = [
  // --- RUTA RAÍZ ---
  { path: '', component: PlanCatalogComponent }, 

  // --- LOGIN ---
  { path: 'login', component: LoginComponent },

  // --- VIVIENDAS (Estilo Registro y Consulta de tu profesor) ---
  { path: 'vivienda/registro', component: RegistroVivienda },
  { path: 'vivienda/mantenimiento', component: ConsultaVivienda },

  // --- REDIRECCIONES ---
  { path: 'planes', redirectTo: '', pathMatch: 'full' },
  
  // COMODÍN (Si la ruta no existe, manda al catálogo)
  { path: '**', redirectTo: '', pathMatch: 'full' }
];