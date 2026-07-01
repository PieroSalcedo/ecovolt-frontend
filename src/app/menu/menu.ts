import { Component, OnInit } from '@angular/core';
import { TokenService } from '../security/token';
import { Opcion } from '../models/opcion.model';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './menu.html'
})
export class MenuComponent implements OnInit {
  isLogged = false;
  opciones: Opcion[] = [];
  nombreUsuario = '';

  constructor(private tokenService: TokenService) { }

  ngOnInit(): void {
    if (this.tokenService.getToken()) {
      this.isLogged = true;
      this.opciones = this.tokenService.getOpciones();
      this.nombreUsuario = this.tokenService.getUserNameComplete() || '';
    }
  }

  onLogOut(): void {
    this.tokenService.logOut();
    window.location.reload();
  }
}