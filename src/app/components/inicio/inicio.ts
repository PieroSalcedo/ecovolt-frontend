import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { NavigationEnd, Router, RouterModule } from '@angular/router'; // Importar RouterModule
import { Subscription, filter } from 'rxjs';
import { TokenService } from '../../security/token';
import { ViviendaService } from '../../services/vivienda';
import { CuartoService } from '../../services/cuarto';
import { DispositivoService } from '../../services/dispositivo';
import { PlanService } from '../../services/plan';
import { UserService } from '../../services/user';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatCardModule, MatButtonModule, RouterModule],
  templateUrl: './inicio.html',
  styleUrls: ['../plan-catalog/plan-catalog.css']
})
export class InicioComponent implements OnInit, OnDestroy {
  planes: any[] = [];
  showPlanes = false;
  isLogged = false; // Variable para controlar el estado de sesión
  idPlanActual: number = 0;
  totalViviendas = 0;
  totalCuartos = 0;
  totalDispositivos = 0;
  private routerSubscription?: Subscription;

  constructor(
    public tokenService: TokenService,
    private viviendaService: ViviendaService,
    private cuartoService: CuartoService,
    private dispositivoService: DispositivoService,
    private planService: PlanService,
    private userService: UserService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // 1. Detectar si hay sesión activa
    this.isLogged = !!this.tokenService.getToken();

    const planGuardado = this.tokenService.getPlanId();
    this.idPlanActual = planGuardado ? Number(planGuardado) : 0;

    this.cargarPlanes();
    this.actualizarVistaPorRuta();

    // 2. Solo cargar indicadores si el usuario está logueado
    if (this.isLogged) {
      this.cargarIndicadores();
    }

    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.actualizarVistaPorRuta());
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
  }

  actualizarVistaPorRuta() {
    // Si la ruta es /planes o el usuario no está logueado, mostramos los planes
    this.showPlanes = this.router.url.startsWith('/planes') || !this.isLogged;
    this.cd.detectChanges();
  }

  cargarIndicadores() {
    this.viviendaService.consultaDinamica('', '', -1).subscribe({
      next: (res) => { this.totalViviendas = (res.data || []).length; this.cd.detectChanges(); },
      error: () => { this.totalViviendas = 0; this.cd.detectChanges(); }
    });

    this.cuartoService.consultaDinamica('', -1, -1).subscribe({
      next: (res) => { this.totalCuartos = (res.data || []).length; this.cd.detectChanges(); },
      error: () => { this.totalCuartos = 0; this.cd.detectChanges(); }
    });

    this.dispositivoService.consultaDinamica(-1, -1, '').subscribe({
      next: (res) => { this.totalDispositivos = (res.data || []).length; this.cd.detectChanges(); },
      error: () => { this.totalDispositivos = 0; this.cd.detectChanges(); }
    });
  }

  cargarPlanes() {
    this.planService.listaPlanes().subscribe({
      next: (res) => { this.planes = res.data || []; this.cd.detectChanges(); },
      error: () => { this.planes = []; this.cd.detectChanges(); }
    });
  }

  ejecutarAccion(idPlan: number) {
    if (!this.isLogged) {
      // SI NO ESTÁ LOGUEADO: Mandamos al registro con el parámetro del plan
      this.router.navigate(['/register'], { queryParams: { plan: idPlan } });
    } else {
      // SI ESTÁ LOGUEADO: Lógica de mejora de plan (Upgrade)
      if (idPlan === this.idPlanActual) return;

      Swal.fire({
        title: 'Mejorar suscripción',
        text: 'Se actualizaran tus beneficios al instante.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#4f46e5',
        confirmButtonText: 'Sí, actualizar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.userService.upgradePlan(idPlan).subscribe(res => {
            Swal.fire('¡Éxito!', res.message, 'success');
            this.tokenService.setPlanId(idPlan.toString());
            this.idPlanActual = idPlan;
            this.cd.detectChanges();
          });
        }
      });
    }
  }
}