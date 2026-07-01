import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from './menu/menu'; // <--- 1. IMPORTA EL COMPONENTE

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MenuComponent], // <--- 2. AGRÉGALO AQUÍ
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ecovolt-frontend');
}