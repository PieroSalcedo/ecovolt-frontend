import { Component, OnInit } from '@angular/core';
import { PlanService } from '../../services/plan';
import { Plan } from '../../models/plan.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'; 
import Swal from 'sweetalert2';

@Component({
  selector: 'app-plan-catalog',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule
  ],
  templateUrl: './plan-catalog.html',
  styleUrls: ['./plan-catalog.css']
})
export class PlanCatalogComponent implements OnInit {
  planes: Plan[] = [];

  constructor(private planService: PlanService) { }

  ngOnInit(): void {
    this.planService.listaPlanes().subscribe(res => {
      this.planes = res.data || [];
    });
  }

  verDetalle(plan: Plan) {
    Swal.fire({
      title: `<span style="color: #4f46e5">${plan.name}</span>`,
      html: `
        <div class="text-left">
          <p><b>Costo:</b> S/ ${plan.monthlyPrice}</p>
          <p><b>Límite:</b> ${plan.deviceLimit} dispositivos IoT</p>
          <p><b>Ciclo:</b> ${plan.billingCycle}</p>
          <hr>
          <p>${plan.description}</p>
        </div>
      `,
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#4f46e5',
      iconColor: '#0891b2',
      icon: 'info'
    });
  }
}
