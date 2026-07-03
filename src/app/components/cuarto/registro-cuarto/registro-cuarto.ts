import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CuartoService } from '../../../services/cuarto';
import { ViviendaService } from '../../../services/vivienda';
import { UtilService } from '../../../services/util';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro-cuarto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule],
  templateUrl: './registro-cuarto.html'
})
export class RegistroCuarto implements OnInit {
  forms: FormGroup;
  tipos: any[] = [];
  viviendas: any[] = [];

  constructor(
    private fb: FormBuilder, 
    private util: UtilService, 
    private vService: ViviendaService,
    private cService: CuartoService
  ) {
    // Inicializamos todos los campos requeridos por tu BD
    this.forms = this.fb.group({
      name: ['', Validators.required],
      orientation: [''],
      floorNumber: [1, Validators.required],
      areaSqm: [0, Validators.required],
      idRoomType: [-1, [Validators.required, Validators.min(1)]],
      idHome: [-1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    // Cargar Catálogo de Habitaciones
    this.util.getCatalog('TIPO_HABITACION').subscribe(res => this.tipos = res.data || []);
    // Cargar Mis Viviendas (para saber dónde registrar el cuarto)
    this.vService.consultaDinamica("", "", -1).subscribe(res => this.viviendas = res.data || []);
  }

  registrar() {
    if (this.forms.invalid) return;

    this.cService.registra(this.forms.value).subscribe(res => {
      Swal.fire("Éxito", res.message, "success");
      // Reseteamos con valores por defecto
      this.forms.reset({ floorNumber: 1, areaSqm: 0, idRoomType: -1, idHome: -1 });
    });
  }
}