import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgChartsModule, BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

import { ReadingService } from '../../../services/reading';
import { ViviendaService } from '../../../services/vivienda';
import { CuartoService } from '../../../services/cuarto';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-reporte-consumo',
  standalone: true,
  imports: [CommonModule, FormsModule, NgChartsModule, MatToolbarModule, MatCardModule, MatIconModule],
  templateUrl: './reporte-consumo.html',
  styleUrls: ['./reporte-consumo.css']
})
export class ReporteConsumo implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  misCasas: any[] = [];
  misCuartos: any[] = [];
  idHomeSel: number = -1;
  idRoomSel: number = -1;

  // GRÁFICO 1: Barras (Viviendas)
  public barData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [{ data: [], label: 'Watts Totales', backgroundColor: '#1b4332' }]
  };

  // GRÁFICO 2: Pie (Cuartos)
  public pieData: ChartConfiguration<'pie'>['data'] = {
    labels: [],
    datasets: [{ data: [], backgroundColor: ['#52b788', '#95d5b2', '#2d6a4f', '#d8f3dc'] }]
  };

  // GRÁFICO 3: Barras (Dispositivos)
  public deviceData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [{ data: [], label: 'Gasto por Equipo (W)', backgroundColor: '#ef4444' }]
  };

  constructor(
    private rService: ReadingService, 
    private vService: ViviendaService,
    private cService: CuartoService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Carga inicial: Todas las casas de Alonso
    this.vService.consultaDinamica("", "", -1).subscribe(res => {
      this.misCasas = res.data || [];
      this.cd.detectChanges();
    });
    this.cargarGraficoGeneral();
  }

  cargarGraficoGeneral() {
    this.rService.reporteCasas().subscribe(data => {
      this.barData.labels = data.map(x => x.casa);
      this.barData.datasets[0].data = data.map(x => x.consumo);
      this.cd.detectChanges();
    });
  }

  onCasaChange() {
    if (this.idHomeSel == -1) {
      this.misCuartos = [];
      this.idRoomSel = -1;
      return;
    }
    // 1. Cargar gráfico de Cuartos
    this.rService.reporteCuartos(this.idHomeSel).subscribe(data => {
      this.pieData.labels = data.map(x => x.cuarto);
      this.pieData.datasets[0].data = data.map(x => x.consumo);
      this.cd.detectChanges();
    });
    // 2. Cargar lista de cuartos para el combo
    this.cService.consultaDinamica("", this.idHomeSel, -1).subscribe(res => {
      this.misCuartos = res.data || [];
      this.idRoomSel = -1;
      this.cd.detectChanges();
    });
  }

  onRoomChange() {
    if (this.idRoomSel == -1) return;
    // Cargar gráfico de Dispositivos del cuarto seleccionado
    this.rService.reporteDispositivos(this.idRoomSel).subscribe(data => {
      this.deviceData.labels = data.map(x => x.dispositivo);
      this.deviceData.datasets[0].data = data.map(x => x.consumo);
      this.cd.detectChanges();
    });
  }
}