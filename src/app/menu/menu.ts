import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { TokenService } from '../security/token';
import { Opcion } from '../models/opcion.model';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, MatIconModule],
  templateUrl: './menu.html',
  styleUrls: ['./menu.css']
})
export class MenuComponent implements OnInit {
  isLogged: boolean = false;
  nombreUsuario: string = '';
  opcRegistro: Opcion[] = [];
  opcConsulta: Opcion[] = [];
  opcCRUD: Opcion[] = [];
  opcTransacciones: Opcion[] = [];

  constructor(private tokenService: TokenService, private router: Router) { }

  ngOnInit(): void {
    const token = this.tokenService.getToken();
    if (token) {
      this.isLogged = true;
      this.nombreUsuario = this.tokenService.getUserNameComplete() || '';
      
      const todas = this.tokenService.getOpciones();
      console.log("TODAS LAS OPCIONES RECIBIDAS:", todas); // <--- MIRA ESTO EN LA CONSOLA (F12)

      // Usamos == (dos iguales) por si el tipo viene como string desde el JSON
      this.opcRegistro = todas.filter(x => x.type == 1);
      this.opcConsulta = todas.filter(x => x.type == 2);
      this.opcCRUD = todas.filter(x => x.type == 3);
      this.opcTransacciones = todas.filter(x => x.type == 4);
    }
  }

  onLogOut(): void {
    this.tokenService.logOut();
    window.location.href = '/';
  }
}