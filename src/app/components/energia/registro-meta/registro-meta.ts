import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

import { ViviendaService } from '../../../services/vivienda';
import { CuartoService } from '../../../services/cuarto';
import { DispositivoService } from '../../../services/dispositivo';
import { GoalService } from '../../../services/goal';

import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-meta-registro',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatToolbarModule, MatIconModule
  ],
  templateUrl: './registro-meta.html'
})
export class RegistroMeta implements OnInit {

  forms: FormGroup;
  nivelMeta: string = 'CASA';

  misCasas: any[] = [];
  misCuartos: any[] = [];
  misDispositivos: any[] = [];

  idHomeAux: number = -1;
  idRoomAux: number = -1;
  idDeviceAux: number = -1;

  constructor(
    private fb: FormBuilder,
    private vService: ViviendaService,
    private cService: CuartoService,
    private dService: DispositivoService,
    private gService: GoalService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {
    this.forms = this.fb.group({
      targetValue: [90, [Validators.required, Validators.min(0.1)]],
      alertThresholdPercentage: [80, [Validators.required, Validators.min(1), Validators.max(100)]],
      idHome: [null],
      idRoom: [null],
      idDevice: [null]
    });
  }

  ngOnInit() {
    this.vService.consultaDinamica('', '', -1).subscribe(res => {
      this.misCasas = res.data || [];

      this.route.queryParams.subscribe(params => {
        if (params['nivel']) {
          this.nivelMeta = params['nivel'];
          this.idHomeAux = Number(params['home']);
          this.onCasaChange();

          if (params['room'] && params['room'] != -1) {
            setTimeout(() => {
              this.idRoomAux = Number(params['room']);
              this.onRoomChange();

              if (params['device'] && params['device'] != -1) {
                setTimeout(() => {
                  this.onDeviceChange(Number(params['device']));
                  this.cd.detectChanges();
                }, 300);
              }
            }, 300);
          }
        }
      });
    });
  }

  cambioNivel() {
    this.idHomeAux = -1;
    this.idRoomAux = -1;
    this.idDeviceAux = -1;
    this.misCuartos = [];
    this.misDispositivos = [];
    this.forms.patchValue({ idHome: null, idRoom: null, idDevice: null });
  }

  onCasaChange() {
    this.idRoomAux = -1;
    this.idDeviceAux = -1;
    this.misCuartos = [];
    this.misDispositivos = [];
    this.forms.patchValue({ idHome: null, idRoom: null, idDevice: null });

    if (this.idHomeAux != -1) {
      this.forms.patchValue({ idHome: Number(this.idHomeAux) });

      this.cService.consultaDinamica('', this.idHomeAux, -1).subscribe(res => {
        this.misCuartos = res.data || [];
        this.cd.detectChanges();
      });
    }
  }

  onRoomChange() {
    this.idDeviceAux = -1;
    this.misDispositivos = [];
    this.forms.patchValue({ idDevice: null });

    if (this.idRoomAux != -1) {
      if (this.nivelMeta === 'CUARTO') {
        this.forms.patchValue({ idRoom: Number(this.idRoomAux) });
      }

      this.dService.consultaDinamica(this.idHomeAux, this.idRoomAux, '').subscribe(res => {
        this.misDispositivos = res.data || [];
        this.cd.detectChanges();
      });
    }
  }

  onDeviceChange(idDev: number) {
    this.idDeviceAux = Number(idDev);
    if (this.nivelMeta === 'DISPOSITIVO') {
      this.forms.patchValue({ idDevice: Number(idDev), idRoom: Number(this.idRoomAux) });
    }
  }

  registrar() {
    if (this.nivelMeta === 'CASA') {
      this.forms.patchValue({ idHome: Number(this.idHomeAux), idRoom: null, idDevice: null });
    } else if (this.nivelMeta === 'CUARTO') {
      this.forms.patchValue({ idHome: Number(this.idHomeAux), idRoom: Number(this.idRoomAux), idDevice: null });
    } else {
      this.forms.patchValue({ idHome: Number(this.idHomeAux), idRoom: Number(this.idRoomAux), idDevice: Number(this.idDeviceAux) });
    }

    if (
      this.forms.invalid ||
      this.idHomeAux < 1 ||
      (this.nivelMeta !== 'CASA' && this.idRoomAux < 1) ||
      (this.nivelMeta === 'DISPOSITIVO' && this.idDeviceAux < 1)
    ) {
      this.forms.markAllAsTouched();
      Swal.fire('Datos no validos', 'Selecciona el nivel completo y verifica limite mensual y umbral.', 'warning');
      return;
    }

    this.gService.registrar(this.forms.value).subscribe({
      next: () => {
        Swal.fire('Exito', 'Meta de ahorro establecida', 'success');
        this.forms.reset({ targetValue: 90, alertThresholdPercentage: 80 });
        this.cambioNivel();
      },
      error: (err) => Swal.fire('Error', err.error?.message || 'No se pudo guardar la meta', 'error')
    });
  }
}
