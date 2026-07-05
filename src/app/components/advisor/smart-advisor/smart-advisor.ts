import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import Swal from 'sweetalert2';
import { AdvisorService } from '../../../services/advisor';
import { ViviendaService } from '../../../services/vivienda';
import { EnergyAdvisorResponse } from '../../../models/advisor.model';
import { Vivienda } from '../../../models/vivienda.model';

@Component({
  selector: 'app-smart-advisor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule
  ],
  templateUrl: './smart-advisor.html'
})
export class SmartAdvisor implements OnInit {
  viviendas: Vivienda[] = [];
  idHome: number = -1;
  period: string = "MONTHLY";
  cargando: boolean = false;
  resultado: EnergyAdvisorResponse | null = null;

  periodos = [
    { value: 'DAILY', label: 'Hoy' },
    { value: 'WEEKLY', label: 'Ultimos 7 dias' },
    { value: 'MONTHLY', label: 'Mes actual' }
  ];

  constructor(
    private advisorService: AdvisorService,
    private viviendaService: ViviendaService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.viviendaService.consultaDinamica("", "", -1).subscribe({
      next: (res) => {
        this.viviendas = res.data || [];
        if (this.viviendas.length > 0) {
          this.idHome = Number(this.viviendas[0].idHome);
        }
        this.cd.detectChanges();
      },
      error: (err) => {
        Swal.fire('Error', err.error?.message || 'No se pudieron cargar tus viviendas.', 'error');
      }
    });
  }

  analizar() {
    if (this.idHome < 1) {
      Swal.fire('Validacion', 'Selecciona una vivienda para analizar.', 'warning');
      return;
    }

    this.cargando = true;
    this.resultado = null;

    this.advisorService.analizar({ idHome: Number(this.idHome), period: this.period }).subscribe({
      next: (res) => {
        this.resultado = res.data || null;
        this.cargando = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        this.cargando = false;
        Swal.fire('Error', err.error?.message || 'No se pudo generar el analisis energetico.', 'error');
        this.cd.detectChanges();
      }
    });
  }

  getRiskLabel(): string {
    switch (this.resultado?.riskLevel) {
      case 'HIGH': return 'Riesgo alto';
      case 'MEDIUM': return 'Riesgo medio';
      case 'LOW': return 'Riesgo bajo';
      default: return 'Sin clasificar';
    }
  }

  getRiskColor(): string {
    switch (this.resultado?.riskLevel) {
      case 'HIGH': return '#ef4444';
      case 'MEDIUM': return '#f59e0b';
      case 'LOW': return '#0891b2';
      default: return '#64748b';
    }
  }

  getPriorityColor(priority: string | undefined): string {
    switch (priority) {
      case 'HIGH': return '#ef4444';
      case 'MEDIUM': return '#f59e0b';
      case 'LOW': return '#0891b2';
      default: return '#64748b';
    }
  }
}
