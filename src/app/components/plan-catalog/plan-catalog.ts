import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // <--- 1. IMPORTAR ESTO
import { PlanService } from '../../services/plan';
import { TokenService } from '../../security/token';
import { UserService } from '../../services/user';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-plan-catalog',
  standalone: true,
  imports: [
    CommonModule, // <--- 2. AGREGAR AQUÍ (Fundamental para *ngFor y *ngIf)
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './plan-catalog.html',
  styleUrls: ['./plan-catalog.css']
})
export class PlanCatalogComponent implements OnInit {
  planes: any[] = [];
  isLogged = false;
  idPlanActual: number = 0;

  constructor(
    private planService: PlanService, 
    public tokenService: TokenService, // Debe ser public para el HTML
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.isLogged = !!this.tokenService.getToken();
    
    // Leemos el plan del token service
    const planGuardado = this.tokenService.getPlanId();
    this.idPlanActual = planGuardado ? Number(planGuardado) : 0;

    this.planService.listaPlanes().subscribe({
      next: (res) => {
        this.planes = res.data || [];
      },
      error: (err) => console.error("Error cargando planes", err)
    });
  }

  ejecutarAccion(idPlan: number) {
    if (!this.isLogged) {
      this.router.navigate(['/register'], { queryParams: { plan: idPlan } });
    } else {
      if (idPlan === this.idPlanActual) return;

      Swal.fire({
        title: '¿Cambiar de plan?',
        text: "Se actualizarán tus beneficios al instante.",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#1b4332',
        confirmButtonText: 'Sí, actualizar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.userService.upgradePlan(idPlan).subscribe(res => {
            Swal.fire('¡Éxito!', res.message, 'success');
            this.tokenService.setPlanId(idPlan.toString());
            this.idPlanActual = idPlan;
          });
        }
      });
    }
  }
}