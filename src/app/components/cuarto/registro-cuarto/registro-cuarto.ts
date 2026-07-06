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
  formularioVisible = false;
  plantillaSeleccionada: any = null;

  plantillas = [
    { nombre: 'Sala Principal', tipo: 'Sala', area: 38, piso: 1, orientacion: 'Norte', imagen: '/rooms/sala-principal.jpg' },
    { nombre: 'Cocina Moderna', tipo: 'Cocina', area: 18, piso: 1, orientacion: 'Este', imagen: '/rooms/cocina-moderna.jpg' },
    { nombre: 'Dormitorio Principal', tipo: 'Habitacion Principal', area: 24, piso: 2, orientacion: 'Sur', imagen: '/rooms/dormitorio-principal.jpg' },
    { nombre: 'Bano Familiar', tipo: 'Bano', area: 9, piso: 1, orientacion: 'Oeste', imagen: '/rooms/bano-familiar.jpg' },
    { nombre: 'Garaje IoT', tipo: 'Garaje', area: 30, piso: 1, orientacion: 'Sur', imagen: '/rooms/garaje-iot.jpg' },
    { nombre: 'Estudio de Trabajo', tipo: 'Sala', area: 16, piso: 2, orientacion: 'Norte', imagen: '/rooms/estudio-trabajo.jpg' },
    { nombre: 'Comedor Familiar', tipo: 'Sala', area: 22, piso: 1, orientacion: 'Este', imagen: '/rooms/comedor-familiar.jpg' },
    { nombre: 'Terraza', tipo: 'Sala', area: 20, piso: 2, orientacion: 'Oeste', imagen: '/rooms/terraza.jpg' },
    { nombre: 'Lavanderia', tipo: 'Cocina', area: 10, piso: 1, orientacion: 'Este', imagen: '/rooms/lavanderia.jpg' },
    { nombre: 'Cuarto de Juegos', tipo: 'Sala', area: 26, piso: 2, orientacion: 'Norte', imagen: '/rooms/cuarto-juegos.jpg' },
    { nombre: 'Dormitorio Secundario', tipo: 'Habitacion Principal', area: 18, piso: 2, orientacion: 'Sur', imagen: '/rooms/dormitorio-secundario.jpg' },
    { nombre: 'Sala de Entretenimiento', tipo: 'Sala', area: 28, piso: 1, orientacion: 'Oeste', imagen: '/rooms/sala-entretenimiento.jpg' }
  ];

  constructor(
    private fb: FormBuilder,
    private util: UtilService,
    private vService: ViviendaService,
    private cService: CuartoService
  ) {
    this.forms = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{3,60}$/)]],
      orientation: ['', [Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]*$/)]],
      floorNumber: [1, [Validators.required, Validators.min(0)]],
      areaSqm: [0, [Validators.required, Validators.min(1)]],
      idRoomType: [-1, [Validators.required, Validators.min(1)]],
      idHome: [-1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.util.getCatalog('TIPO_HABITACION').subscribe(res => this.tipos = res.data || []);
    this.vService.consultaDinamica('', '', -1).subscribe(res => this.viviendas = res.data || []);
  }

  seleccionarPlantilla(plantilla: any) {
    this.plantillaSeleccionada = plantilla;
    this.formularioVisible = true;
    const tipo = this.tipos.find(t => (t.value || '').toLowerCase() === plantilla.tipo.toLowerCase());
    this.forms.patchValue({
      name: plantilla.nombre,
      orientation: plantilla.orientacion,
      floorNumber: plantilla.piso,
      areaSqm: plantilla.area,
      idRoomType: tipo ? tipo.idDataCatalog : -1
    });
  }

  registrar() {
    if (this.forms.invalid) {
      this.forms.markAllAsTouched();
      Swal.fire('Datos no validos', 'Selecciona una vivienda y revisa nombre, piso, area y tipo de ambiente.', 'warning');
      return;
    }

    this.cService.registra(this.forms.value).subscribe({
      next: (res) => {
        Swal.fire('Exito', res.message, 'success');
        this.forms.reset({ floorNumber: 1, areaSqm: 0, idRoomType: -1, idHome: -1 });
        this.formularioVisible = false;
        this.plantillaSeleccionada = null;
      },
      error: (err) => {
        Swal.fire('Error', err.error?.message || 'No se pudo registrar el ambiente.', 'error');
      }
    });
  }
}
