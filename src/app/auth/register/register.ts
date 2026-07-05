import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router, RouterLink } from '@angular/router';
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
export class RegisterComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      login: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onRegister() {
    if (this.form.invalid) return;
    this.authService.register(this.form.value).subscribe({
      next: (res) => {
        Swal.fire('¡Éxito!', res.message, 'success');
        this.router.navigate(['/login']);
      },
      error: (err) => Swal.fire('Error', err.error.message, 'error')
    });
  }
}