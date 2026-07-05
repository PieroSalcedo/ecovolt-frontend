import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgChartsModule, BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';

import { ReadingService } from '../../../services/reading';
import { ViviendaService } from '../../../services/vivienda';
import { CuartoService } from '../../../services/cuarto';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-reporte-consumo',
  standalone: true,
  imports: [CommonModule, FormsModule, NgChartsModule, MatToolbarModule, MatCardModule, MatSelectModule, MatFormFieldModule, MatIcon],
  templateUrl: './reporte-consumo.html',
  styleUrls: ['./reporte-consumo.css']
})
export class ReporteConsumo implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  // Variables de control
  nivel: string = 'VIVIENDA'; // 'VIVIENDA', 'CUARTO', 'DISPOSITIVO'
  misCasas: any[] = [];
  misCuartos: any[] = [];
  idHomeSel: number = -1;
  idRoomSel: number = -1;

  // Configuración Única del Gráfico
  public mainChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [{ data: [], label: 'Consumo (Watts)', backgroundColor: '#2d6a4f', borderRadius: 5 }]
  };

  public mainChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } }
  };

  constructor(
    private rService: ReadingService, 
    private vService: ViviendaService,
    private cService: CuartoService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.vService.consultaDinamica("", "", -1).subscribe(res => this.misCasas = res.data || []);
    this.cargarReporteCasas(); // Por defecto al cargar
  }

  // Lógica de cambio de nivel
  cambiarNivel() {
    this.idHomeSel = -1;
    this.idRoomSel = -1;
    this.misCuartos = [];
    
    if (this.nivel === 'VIVIENDA') {
      this.cargarReporteCasas();
    } else {
      // Limpiar gráfico hasta que seleccionen una casa/cuarto
      this.actualizarGrafico([], [], 'Seleccione un origen');
    }
  }

  cargarReporteCasas() {
    this.rService.reporteCasas().subscribe(data => {
      this.actualizarGrafico(
        data.map(x => x.casa),
        data.map(x => x.consumo),
        'Consumo por Vivienda'
      );
    });
  }

  onCasaChange() {
    if (this.idHomeSel === -1) return;

    // Cargar Cuartos para el combo si el nivel es DISPOSITIVO
    this.cService.consultaDinamica("", this.idHomeSel, -1).subscribe(res => this.misCuartos = res.data || []);

    if (this.nivel === 'CUARTO') {
      this.rService.reporteCuartos(this.idHomeSel).subscribe(data => {
        this.actualizarGrafico(
          data.map(x => x.cuarto),
          data.map(x => x.consumo),
          'Distribución por Cuartos'
        );
      });
    }
  }

  onRoomChange() {
    if (this.idRoomSel === -1) return;
    this.rService.reporteDispositivos(this.idRoomSel).subscribe(data => {
      this.actualizarGrafico(
        data.map(x => x.dispositivo),
        data.map(x => x.consumo),
        'Consumo por Dispositivo'
      );
    });
  }

  // Método central para refrescar el canvas
  actualizarGrafico(labels: string[], data: number[], label: string) {
    this.mainChartData.labels = labels;
    this.mainChartData.datasets[0].data = data;
    this.mainChartData.datasets[0].label = label;
    this.chart?.update();
    this.cd.detectChanges();
  }
}