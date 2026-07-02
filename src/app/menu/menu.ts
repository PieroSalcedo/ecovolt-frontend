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
  const token = this.tokenService.getToken();
  if (token) {
    this.isLogged = true;
    this.opciones = this.tokenService.getOpciones();
    this.nombreUsuario = this.tokenService.getUserNameComplete() || '';
  } else {
    this.isLogged = false;
    this.opciones = [];
    this.nombreUsuario = '';
  }
}

  onLogOut(): void {
    this.tokenService.logOut();
    window.location.reload();
  }
}