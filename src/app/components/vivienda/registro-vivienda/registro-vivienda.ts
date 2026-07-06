import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TokenService } from '../../../security/token';
import { ViviendaService } from '../../../services/vivienda';
import { UtilService } from '../../../services/util';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro-vivienda',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
],
  templateUrl: './registro-vivienda.html'
})
export class RegistroVivienda implements OnInit {
  forms: FormGroup;
  tipos: any[] = [];

  constructor(private fb: FormBuilder, private util: UtilService, private vService: ViviendaService, private tokenService: TokenService) {
    this.forms = this.fb.group({
      alias: ['', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{3,50}$/)]],
      city: ['', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{3,50}$/)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      energyTariff: [0, [Validators.required, Validators.min(0.1)]],
      squareMeters: [0, [Validators.required, Validators.min(1)]], // <-- 1. Agregamos el campo al Form
      idPropertyType: [-1, Validators.min(1)]
    });
  }

  ngOnInit(): void {
    this.util.listaTipoPropiedad().subscribe(res => this.tipos = res.data || []);
  }

  registrar() {
    if (this.forms.invalid) {
      this.forms.markAllAsTouched();
      Swal.fire("Datos no validos", "Revisa los campos: alias y ciudad solo aceptan letras; tarifa y area deben ser mayores a cero.", "warning");
      return;
    }

    // Creamos el objeto exactamente como lo espera el HomeDto.Request de Java
    const data = {
      alias: this.forms.value.alias,
      city: this.forms.value.city,
      address: this.forms.value.address,
      energyTariff: this.forms.value.energyTariff,
      squareMeters: this.forms.value.squareMeters, // <-- 2. Lo mapeamos aquí para que viaje en el JSON
      idPropertyType: this.forms.value.idPropertyType, 
      idUser: Number(this.tokenService.getUserId())    
    };

    this.vService.registra(data).subscribe({
      next: (res) => {
        Swal.fire("Éxito", res.message, "success");
        this.forms.reset({ energyTariff: 0, squareMeters: 0, idPropertyType: -1 }); // Reset estructurado
      },
      error: (err) => {
        console.error(err);
        Swal.fire("Error", "No tienes permisos o la sesión caducó", "error");
      }
    });
  }
}
