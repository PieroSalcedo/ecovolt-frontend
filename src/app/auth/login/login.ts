import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { TokenService } from '../../security/token';
import { LoginUsuario } from '../../security/login-usuario.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MenuComponent } from '../../menu/menu';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './login.html'
})
export class LoginComponent {
  loginUsuario: LoginUsuario = new LoginUsuario();

  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router
  ) { }

  onLogin(): void {
  this.authService.login(this.loginUsuario).subscribe({
    next: (res) => {
      if (res.data) {
        this.tokenService.setToken(res.data.token!);
        this.tokenService.setUserName(res.data.login!);
        this.tokenService.setUserNameComplete(res.data.fullName!);
        this.tokenService.setAuthorities(res.data.roles!);
        this.tokenService.setOpciones(res.data.opciones!);
        this.tokenService.setUserId(res.data.idUser.toString());

        Swal.fire({
          title: res.title,
          text: res.message,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          // CAMBIO CLAVE: Usamos href para que el MenuComponent se refresque
          window.location.href = '/'; 
        });
      }
    },
    error: (err) => {
      Swal.fire('Error', 'Credenciales incorrectas', 'error');
    }
  });
  }
}