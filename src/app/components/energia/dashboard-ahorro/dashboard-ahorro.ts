import { AfterViewInit, ChangeDetectorRef, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgChartsModule, BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { MatIconModule } from '@angular/material/icon';
import { CuartoService } from '../../../services/cuarto';
import { ReadingService } from '../../../services/reading';
import { ViviendaService } from '../../../services/vivienda';

@Component({
    selector: 'app-dashboard-ahorro',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        NgChartsModule,
        MatIconModule
    ],
    templateUrl: './dashboard-ahorro.html',
    styleUrls: ['./dashboard-ahorro.css']
})
export class DashboardAhorro implements OnInit, AfterViewInit {

    @ViewChildren(BaseChartDirective) charts!: QueryList<BaseChartDirective>;

    misCasas: any[] = [];
    misCuartos: any[] = [];
    casaSel: number = -1;
    cuartoSel: number = -1;

    hasCasaData: boolean = false;
    hasCuartoData: boolean = false;
    hasDispositivoData: boolean = false;
    totalCasas: number = 0;
    totalCuartos: number = 0;
    totalDispositivos: number = 0;

    constructor(
        private vService: ViviendaService,
        private cService: CuartoService,
        private rService: ReadingService,
        private cd: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.cargarViviendas();
        this.cargarCasas();
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.updateCharts();
        }, 500);

        window.addEventListener('resize', () => {
            this.updateCharts();
        });
    }

    updateCharts() {
        if (this.charts) {
            this.charts.forEach(chart => {
                if (chart && chart.chart) {
                    chart.chart.update();
                }
            });
            console.log('Graficos actualizados:', this.charts.length);
        }
    }

    barCasaData: ChartConfiguration<'bar'>['data'] = {
        labels: [],
        datasets: [{
            data: [],
            label: 'Consumo por Vivienda',
            backgroundColor: 'rgba(54, 162, 235, 0.7)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        }]
    };

    barOptions: ChartOptions<'bar'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    font: { size: 13 }
                }
            },
            title: {
                display: true,
                text: 'Consumo por Vivienda',
                font: { size: 16, weight: 'bold' }
            }
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    pieCuartoData: ChartConfiguration<'pie'>['data'] = {
        labels: [],
        datasets: [{
            data: [],
            label: 'Consumo por Cuarto',
            backgroundColor: [
                'rgba(75, 192, 192, 0.8)',
                'rgba(255, 99, 132, 0.8)',
                'rgba(255, 205, 86, 0.8)',
                'rgba(153, 102, 255, 0.8)',
                'rgba(54, 162, 235, 0.8)'
            ],
            borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(255, 205, 86, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(54, 162, 235, 1)'
            ],
            borderWidth: 2
        }]
    };

    pieOptions: ChartOptions<'pie'> = {
        responsive: true,
        maintainAspectRatio: false,
        aspectRatio: 1,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    font: { size: 13 }
                }
            },
            title: {
                display: true,
                text: 'Distribucion por Cuarto',
                font: { size: 16, weight: 'bold' }
            }
        }
    };

    barDispositivoData: ChartConfiguration<'bar'>['data'] = {
        labels: [],
        datasets: [{
            data: [],
            label: 'Consumo por Dispositivo',
            backgroundColor: 'rgba(153, 102, 255, 0.7)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1
        }]
    };

    horizontalBarOptions: ChartOptions<'bar'> = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    font: { size: 13 }
                }
            },
            title: {
                display: true,
                text: 'Consumo por Dispositivo',
                font: { size: 16, weight: 'bold' }
            }
        },
        scales: {
            x: {
                beginAtZero: true
            }
        }
    };

    cargarViviendas() {
        this.vService.consultaDinamica('', '', -1).subscribe({
            next: (data) => {
                this.misCasas = data.data || [];
                if (this.misCasas.length > 0 && this.casaSel === -1) {
                    this.casaSel = Number(this.misCasas[0].idHome);
                    this.cargarCuartos();
                }
                this.cd.detectChanges();
            },
            error: (error) => {
                console.error('Error al cargar viviendas:', error);
            }
        });
    }

    cargarCasas() {
        this.rService.graficoConsumoPorCasa().subscribe({
            next: (data) => {
                console.log('Datos por vivienda:', data);
                if (data && data.length > 0) {
                    this.barCasaData.labels = data.map(item => item.casa || 'Vivienda');
                    this.barCasaData.datasets[0].data = data.map(item => Number(item.consumo || 0));
                    this.totalCasas = data.reduce((total, item) => total + Number(item.consumo || 0), 0);
                    this.hasCasaData = true;
                }
                this.cd.detectChanges();
                setTimeout(() => this.updateCharts(), 100);
            },
            error: (error) => {
                console.error('Error al cargar datos por vivienda:', error);
            }
        });
    }

    cargarCuartos() {
        this.limpiarCuartos();
        this.limpiarDispositivos();

        if (this.casaSel === -1) {
            return;
        }

        this.cService.consultaDinamica('', this.casaSel, -1).subscribe({
            next: (data) => {
                this.misCuartos = data.data || [];
                if (this.misCuartos.length > 0) {
                    this.cuartoSel = Number(this.misCuartos[0].idRoom);
                    this.cargarDispositivos();
                }
                this.cd.detectChanges();
            },
            error: (error) => {
                console.error('Error al cargar cuartos:', error);
            }
        });

        this.rService.graficoConsumoPorCuarto(this.casaSel).subscribe({
            next: (data) => {
                console.log('Datos por cuarto:', data);
                if (data && data.length > 0) {
                    this.pieCuartoData.labels = data.map(item => item.cuarto || 'Cuarto');
                    this.pieCuartoData.datasets[0].data = data.map(item => Number(item.consumo || 0));
                    this.totalCuartos = data.reduce((total, item) => total + Number(item.consumo || 0), 0);
                    this.hasCuartoData = true;
                }
                this.cd.detectChanges();
                setTimeout(() => this.updateCharts(), 100);
            },
            error: (error) => {
                console.error('Error al cargar datos por cuarto:', error);
            }
        });
    }

    cargarDispositivos() {
        this.limpiarDispositivos();

        if (this.cuartoSel === -1) {
            return;
        }

        this.rService.graficoConsumoPorDispositivo(this.cuartoSel).subscribe({
            next: (data) => {
                console.log('Datos por dispositivo:', data);
                if (data && data.length > 0) {
                    this.barDispositivoData.labels = data.map(item => item.dispositivo || 'Dispositivo');
                    this.barDispositivoData.datasets[0].data = data.map(item => Number(item.consumo || 0));
                    this.totalDispositivos = data.reduce((total, item) => total + Number(item.consumo || 0), 0);
                    this.hasDispositivoData = true;
                }
                this.cd.detectChanges();
                setTimeout(() => this.updateCharts(), 100);
            },
            error: (error) => {
                console.error('Error al cargar datos por dispositivo:', error);
            }
        });
    }

    limpiarCuartos() {
        this.misCuartos = [];
        this.cuartoSel = -1;
        this.hasCuartoData = false;
        this.totalCuartos = 0;
        this.pieCuartoData.labels = [];
        this.pieCuartoData.datasets[0].data = [];
        this.cd.detectChanges();
        setTimeout(() => this.updateCharts(), 100);
    }

    limpiarDispositivos() {
        this.hasDispositivoData = false;
        this.totalDispositivos = 0;
        this.barDispositivoData.labels = [];
        this.barDispositivoData.datasets[0].data = [];
        this.cd.detectChanges();
        setTimeout(() => this.updateCharts(), 100);
    }
}
