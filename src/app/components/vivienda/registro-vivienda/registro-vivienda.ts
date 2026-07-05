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
  textoGeneralPattern = /^(?=.*[A-Za-z\u00C0-\u017F])[A-Za-z\u00C0-\u017F0-9 ]{2,60}$/;
  soloLetrasPattern = /^[A-Za-z\u00C0-\u017F ]{2,60}$/;
  direccionPattern = /^(?=.*[A-Za-z\u00C0-\u017F])[A-Za-z\u00C0-\u017F0-9 .,#°/-]{5,120}$/;
  numeroDecimalPattern = /^[0-9]+(\.[0-9]{1,2})?$/;

  constructor(private fb: FormBuilder, private util: UtilService, private vService: ViviendaService, private tokenService: TokenService) {
    this.forms = this.fb.group({
      alias: ['', [Validators.required, Validators.pattern(this.textoGeneralPattern)]],
      city: ['', [Validators.required, Validators.pattern(this.soloLetrasPattern)]],
      address: ['', [Validators.required, Validators.pattern(this.direccionPattern)]],
      energyTariff: [0, [Validators.required, Validators.pattern(this.numeroDecimalPattern)]],
      squareMeters: [0, [Validators.required, Validators.min(1), Validators.pattern(this.numeroDecimalPattern)]], // <-- 1. Agregamos el campo al Form
      idPropertyType: [-1, Validators.min(1)]
    });
  }

  ngOnInit(): void {
    this.util.listaTipoPropiedad().subscribe(res => this.tipos = res.data || []);
  }

  registrar() {
    if (this.forms.invalid) {
      this.forms.markAllAsTouched();
      Swal.fire('Datos incorrectos', 'Revisa los campos marcados antes de guardar.', 'warning');
      return;
    }

    // Creamos el objeto exactamente como lo espera el HomeDto.Request de Java
    const data = {
      alias: this.forms.value.alias,
      city: this.forms.value.city,
      address: this.forms.value.address,
      energyTariff: Number(this.forms.value.energyTariff),
      squareMeters: Number(this.forms.value.squareMeters), // <-- 2. Lo mapeamos aquí para que viaje en el JSON
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
