import { Component, OnInit } from '@angular/core';
import { TokenService } from '../security/token';
import { Opcion } from '../models/opcion.model';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon'; 

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, MatIconModule],
  templateUrl: './menu.html'
})
export class MenuComponent implements OnInit {
  isLogged = false;
  opciones: Opcion[] = [];
  nombreUsuario = '';

  constructor(private tokenService: TokenService) { }

  ngOnInit(): void {
    this.validarSesion();
  }

  validarSesion(): void {
    const token = this.tokenService.getToken();
    if (token) {
      this.isLogged = true;
      
      // LIMPIEZA DE RUTAS: Quitamos el "/" inicial de lo que viene de la BD
      const opcsBD = this.tokenService.getOpciones();
      this.opciones = opcsBD.map(op => {
        let r = op.route || '';
        if (r.startsWith('/')) { r = r.substring(1); }
        return { ...op, route: r };
      });

      this.nombreUsuario = this.tokenService.getUserNameComplete() || '';
    } else {
      this.isLogged = false;
      this.opciones = [];
      this.nombreUsuario = '';
    }
  }

  onLogOut(): void {
    this.tokenService.logOut();
    window.location.href = '/'; // Forzamos salida a la raíz
  }
}