import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatInputModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './register.html'
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  planIdElegido: number = 1; // Por defecto Plan Essential

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService, 
    private router: Router,
    private route: ActivatedRoute // Para leer los QueryParams
  ) {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      login: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // CAPTURAR EL PLAN DE LA URL: /register?plan=2
    this.route.queryParams.subscribe(params => {
      if (params['plan']) {
        this.planIdElegido = Number(params['plan']);
      }
    });
  }

  onRegister() {
    if (this.form.invalid) return;

    // Fusionamos los datos del form con el ID del plan elegido
    const payload = {
        ...this.form.value,
        idPlan: this.planIdElegido
    };

    this.authService.register(payload).subscribe({
      next: (res) => {
        Swal.fire('¡Éxito!', `Cuenta creada con el ${this.getNombrePlan()}. Por favor, inicia sesión.`, 'success');
        this.router.navigate(['/login']);
      },
      error: (err) => Swal.fire('Error', err.error.message, 'error')
    });
  }

  // Función auxiliar para mostrar el nombre del plan en la UI
  getNombrePlan(): string {
      switch(this.planIdElegido) {
          case 1: return 'Plan Essential';
          case 2: return 'Plan Pro';
          case 3: return 'Plan Unlimited';
          default: return 'Plan Estándar';
      }
  }
}