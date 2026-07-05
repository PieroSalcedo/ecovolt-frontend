import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ViviendaService } from '../../../services/vivienda';
import { GoalService } from '../../../services/goal';
import { ReadingService } from '../../../services/reading';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard-ahorro',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './dashboard-ahorro.html'
})
export class DashboardAhorro implements OnInit {
  // Datos del combo
  misCasas: any[] = [];
  casaSel: number = -1;

  // Datos de la analítica
  consumoActual: number = 0;
  meta: any = null;
  porcentaje: number = 0;

  constructor(
    private vService: ViviendaService, 
    private gService: GoalService, 
    private rService: ReadingService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Cargamos todas las viviendas de Alonso al iniciar
    this.vService.consultaDinamica("", "", -1).subscribe(res => {
      this.misCasas = res.data || [];
      console.log("Casas cargadas:", this.misCasas);
      this.cd.detectChanges();
    });
  }

  actualizarDatos() {
    // Si no selecciona nada, limpiamos la pantalla
    if(this.casaSel == -1) {
      this.meta = null;
      this.consumoActual = 0;
      return;
    }

    // 1. Buscamos la Meta activa para la casa seleccionada
    this.gService.listarActivasPorVivienda(this.casaSel).subscribe(resMeta => {
      if(resMeta.data && resMeta.data.length > 0) {
        this.meta = resMeta.data[0];

        // 2. Calculamos fechas del mes actual (Día 1 hasta hoy) para el reporte
        const hoy = new Date();
        const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1).toISOString();
        const finHoy = hoy.toISOString();

        // 3. Pedimos al backend el consumo total acumulado en ese rango
        this.rService.getConsumoTotal(this.casaSel, inicioMes, finHoy).subscribe(resCons => {
          this.consumoActual = resCons.data || 0;

          // 4. Calculamos el porcentaje de gasto (consumo / límite * 100)
          // El campo targetValue es el que trae el valor de monthlyLimitKwh del DTO
          this.porcentaje = (this.consumoActual / this.meta.targetValue) * 100;

          // Alerta si supera el umbral configurado por Alonso
          if(this.porcentaje >= (this.meta.alertThresholdPercentage || 80)) {
            Swal.fire({
              title: '¡ALERTA ECOVOLT!',
              text: `Has superado el ${this.meta.alertThresholdPercentage}% de tu meta mensual.`,
              icon: 'warning',
              confirmButtonColor: '#d33'
            });
          }
          this.cd.detectChanges();
        });
      } else {
        this.meta = null;
        Swal.fire("Sin Meta", "Aún no has definido un presupuesto energético para esta casa.", "info");
      }
    });
  }
}