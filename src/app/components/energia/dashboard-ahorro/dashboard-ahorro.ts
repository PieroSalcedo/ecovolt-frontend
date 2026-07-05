import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ViviendaService } from '../../../services/vivienda';
import { CuartoService } from '../../../services/cuarto';
import { DispositivoService } from '../../../services/dispositivo';
import { GoalService } from '../../../services/goal';
import { ReadingService } from '../../../services/reading';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-ahorro',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './dashboard-ahorro.html'
})
export class DashboardAhorro implements OnInit {
  nivel: string = 'CASA'; 
  misCasas: any[] = [];
  misCuartos: any[] = [];
  misDispositivos: any[] = [];

  idHomeSel: number = -1;
  idRoomSel: number = -1;
  idDeviceSel: number = -1;

  meta: any = null;
  consumoActual: number = 0;
  porcentaje: number = 0;

  // --- VARIABLES PARA EL COSTO EN SOLES ---
  tarifaSeleccionada: number = 0;
  costoCalculado: number = 0;

  constructor(
    private vService: ViviendaService, 
    private cService: CuartoService,
    private dService: DispositivoService,
    private gService: GoalService,
    private rService: ReadingService,
    private cd: ChangeDetectorRef,
    private router: Router,
  ) {}

  ngOnInit() {
    this.vService.consultaDinamica("", "", -1).subscribe(res => {
        this.misCasas = res.data || [];
        this.cd.detectChanges();
    });
  }

  irAConfigurarMeta() {
    this.router.navigate(['/energia/meta'], {
        queryParams: { nivel: this.nivel, home: this.idHomeSel, room: this.idRoomSel, device: this.idDeviceSel }
    });
  }

  cambioNivel() {
    this.idHomeSel = -1;
    this.idRoomSel = -1;
    this.idDeviceSel = -1;
    this.meta = null;
    this.consumoActual = 0;
    this.tarifaSeleccionada = 0;
    this.costoCalculado = 0;
  }

  onCasaChange() {
    this.idRoomSel = -1;
    this.idDeviceSel = -1;
    this.meta = null;
    this.consumoActual = 0;

    // 1. CAPTURAR LA TARIFA DE LA CASA SELECCIONADA
    const casa = this.misCasas.find(c => c.idHome == this.idHomeSel);
    this.tarifaSeleccionada = casa ? casa.energyTariff : 0;

    this.cService.consultaDinamica("", this.idHomeSel, -1).subscribe(res => {
        this.misCuartos = res.data || [];
        if (this.nivel === 'CASA' && this.idHomeSel != -1) {
            this.cargarDatosFinales('CASA', this.idHomeSel);
        }
        this.cd.detectChanges();
    });
  }

  onRoomChange() {
    this.idDeviceSel = -1;
    this.meta = null;
    this.consumoActual = 0;

    this.dService.consultaDinamica(this.idHomeSel, this.idRoomSel, "").subscribe(res => {
        this.misDispositivos = res.data || [];
        if (this.nivel === 'CUARTO' && this.idRoomSel != -1) {
            this.cargarDatosFinales('CUARTO', this.idRoomSel);
        }
        this.cd.detectChanges();
    });
  }

  onDeviceChange() {
    if (this.nivel === 'DISPOSITIVO' && this.idDeviceSel != -1) {
        this.cargarDatosFinales('DISPOSITIVO', this.idDeviceSel);
    }
  }

  cargarDatosFinales(tipo: string, id: number) {
    let obsConsumo;
    if(tipo === 'CASA') obsConsumo = this.rService.getConsumoCasa(id);
    else if(tipo === 'CUARTO') obsConsumo = this.rService.getConsumoCuarto(id);
    else obsConsumo = this.rService.getConsumoDispositivo(id);

    obsConsumo.subscribe(resCons => {
      this.consumoActual = resCons.data || 0;

      // 2. CALCULAR EL COSTO (Consumo * Tarifa)
      this.costoCalculado = this.consumoActual * this.tarifaSeleccionada;

      this.gService.obtenerMetaActiva(tipo, id).subscribe({
        next: (resMeta) => {
          this.meta = resMeta.data;
          this.porcentaje = (this.consumoActual / this.meta.targetValue) * 100;
          
          if (this.porcentaje >= this.meta.alertThresholdPercentage) {
            Swal.fire({ title: '¡ALERTA!', text: 'Consumo crítico detectado', icon: 'warning', toast: true, position: 'top-end', timer: 3000, showConfirmButton: false });
          }
          this.cd.detectChanges();
        },
        error: () => {
          this.meta = null;
          this.porcentaje = 0;
          this.cd.detectChanges();
        }
      });
    });
  }
}