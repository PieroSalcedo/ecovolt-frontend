import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DispositivoService } from '../../../services/dispositivo';
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
  selector: 'app-registro-dispositivo',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './registro-dispositivo.html'
})
export class RegistroDispositivo implements OnInit {
  forms: FormGroup;
  viviendas: any[] = [];
  cuartos: any[] = [];
  categorias: any[] = [];
  textoGeneralPattern = /^(?=.*[A-Za-z\u00C0-\u017F])[A-Za-z\u00C0-\u017F0-9 ]{2,60}$/;
  serialPattern = /^[A-Za-z0-9:-]{3,40}$/;

  constructor(
    private fb: FormBuilder,
    private vService: ViviendaService,
    private cService: CuartoService,
    private dService: DispositivoService,
    private utilService: UtilService
  ) {
    this.forms = this.fb.group({
      idHome: [-1, [Validators.required, Validators.min(1)]],
      idRoom: [{ value: -1, disabled: true }, [Validators.required, Validators.min(1)]],
      name: ['', [Validators.required, Validators.pattern(this.textoGeneralPattern)]],
      serialNumber: ['', [Validators.required, Validators.pattern(this.serialPattern)]],
      brand: ['', [Validators.required, Validators.pattern(this.textoGeneralPattern)]],
      idCategory: [-1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.vService.consultaDinamica("", "", -1).subscribe(res => this.viviendas = res.data || []);
    this.utilService.getCatalog('CATEGORIA_DISPOSITIVO').subscribe(res => this.categorias = res.data || []);
  }

  onHomeChange(homeId: number) {
    this.cuartos = [];

    if (homeId > 0) {
      this.cService.consultaDinamica("", homeId, -1).subscribe({
        next: (roomRes) => {
          this.cuartos = roomRes.data || [];
          if (this.cuartos.length > 0) {
            this.forms.get('idRoom')?.enable();
          } else {
            this.forms.get('idRoom')?.disable();
          }
          this.forms.patchValue({ idRoom: -1 });
        },
        error: (err) => {
          console.error(err);
          this.forms.get('idRoom')?.disable();
          this.forms.patchValue({ idRoom: -1 });
        }
      });
    } else {
      this.forms.get('idRoom')?.disable();
      this.forms.patchValue({ idRoom: -1 });
    }
  }

  registrar() {
    if (this.forms.invalid) {
      this.forms.markAllAsTouched();
      Swal.fire('Datos incorrectos', 'Revisa los campos marcados antes de vincular el equipo.', 'warning');
      return;
    }

    this.dService.registra(this.forms.getRawValue()).subscribe({
      next: (res) => {
        Swal.fire("Vinculo Exitoso", res.message, "success");
        this.forms.reset({ idHome: -1, idRoom: -1, idCategory: -1 });
        this.forms.get('idRoom')?.disable();
        this.cuartos = [];
      },
      error: (err) => {
        Swal.fire("Error", err.error?.message || "No se pudo registrar el dispositivo.", "error");
      }
    });
  }
}
