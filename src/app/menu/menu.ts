import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router'; // <--- Router es vital
import { TokenService } from '../security/token';
import { CommonModule } from '@angular/common';
import { Option } from '../models/option.models'; 
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
  opcRegistro: Option[] = [];
  opcConsulta: Option[] = [];
  opcCRUD: Option[] = [];
  opcTransacciones: Option[] = [];

  // Inyectamos el Router para forzar la navegación
  constructor(private tokenService: TokenService, private router: Router) { }

  ngOnInit(): void {
    const token = this.tokenService.getToken();
    if (token) {
      this.isLogged = true;
      this.nombreUsuario = this.tokenService.getUserNameComplete() || 'Usuario';
      
      const todas = this.tokenService.getOpciones();
      
      this.opcRegistro = todas.filter(x => x.type == 1);
      this.opcConsulta = todas.filter(x => x.type == 2);
      this.opcCRUD = todas.filter(x => x.type == 3);
      this.opcTransacciones = todas.filter(x => x.type == 4);
    }
  }

  // FUNCIÓN MAESTRA DE NAVEGACIÓN (Evita el redireccionamiento a /)
  navegar(ruta: string | undefined): void {
    if (ruta) {
      // Forzamos la navegación absoluta
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/' + ruta]);
      });
    }
  }

  onLogOut(): void {
    this.tokenService.logOut();
    window.location.href = '/';
  }
}