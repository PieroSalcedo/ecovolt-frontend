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
  
  // Listas Dinámicas
  misCasas: any[] = [];
  misCuartos: any[] = [];
  misDispositivos: any[] = [];

  // IDs auxiliares para la cascada (fuera del form)
  idHomeAux: number = -1;
  idRoomAux: number = -1;

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
      targetValue: [0, [Validators.required, Validators.min(0.1)]],
      alertThresholdPercentage: [80, [Validators.required]],
      idHome: [null],
      idRoom: [null],
      idDevice: [null]
    });
  }

  ngOnInit() {
    // 1. Cargar todas las listas iniciales (como ya hacías)
    this.vService.consultaDinamica("", "", -1).subscribe(res => {
        this.misCasas = res.data || [];
        
        // 2. DESPUÉS de cargar las casas, miramos si venimos del Monitor
        this.route.queryParams.subscribe(params => {
            if (params['nivel']) {
                this.nivelMeta = params['nivel'];
                this.idHomeAux = Number(params['home']);
                
                // Disparamos la cascada manualmente
                this.onCasaChange(); 

                // Si venía un cuarto
                if (params['room'] && params['room'] != -1) {
                    setTimeout(() => { // Pequeño delay para que el combo de cuartos se llene
                        this.idRoomAux = Number(params['room']);
                        this.onRoomChange();
                        
                        // Si venía un dispositivo
                        if (params['device'] && params['device'] != -1) {
                            setTimeout(() => {
                                const idDev = Number(params['device']);
                                this.onDeviceChange(idDev);
                                this.cd.detectChanges();
                            }, 500);
                        }
                    }, 500);
                }
            }
        });
    });
    // Cargar lo demás...
    this.cService.consultaDinamica("", -1, -1).subscribe(res => this.misCuartos = res.data || []);
    this.dService.listarMisDispositivos().subscribe(res => this.misDispositivos = res.data || []);
}

  // Al cambiar el nivel (CASA, CUARTO, DISPOSITIVO)
  cambioNivel() {
    this.idHomeAux = -1;
    this.idRoomAux = -1;
    this.misCuartos = [];
    this.misDispositivos = [];
    this.forms.patchValue({ idHome: null, idRoom: null, idDevice: null });
  }

  // Al elegir Casa -> Cargamos sus Cuartos
  onCasaChange() {
    this.idRoomAux = -1;
    this.misDispositivos = [];
    this.forms.patchValue({ idRoom: null, idDevice: null });

    if (this.idHomeAux != -1) {
      // Si el nivel es CASA, asignamos el ID al formulario
      if (this.nivelMeta === 'CASA') {
          this.forms.patchValue({ idHome: this.idHomeAux });
      }
      
      // Cargamos cuartos de esa casa
      this.cService.consultaDinamica("", this.idHomeAux, -1).subscribe(res => {
        this.misCuartos = res.data || [];
        this.cd.detectChanges();
      });
    }
  }

  // Al elegir Cuarto -> Cargamos sus Dispositivos
  onRoomChange() {
    this.forms.patchValue({ idDevice: null });

    if (this.idRoomAux != -1) {
      // Si el nivel es CUARTO, asignamos el ID al formulario
      if (this.nivelMeta === 'CUARTO') {
          this.forms.patchValue({ idRoom: this.idRoomAux });
      }

      // Cargamos dispositivos de ese cuarto
      this.dService.consultaDinamica(this.idHomeAux, this.idRoomAux, "").subscribe(res => {
        this.misDispositivos = res.data || [];
        this.cd.detectChanges();
      });
    }
  }

  // Al elegir Dispositivo
  onDeviceChange(idDev: number) {
    if (this.nivelMeta === 'DISPOSITIVO') {
        this.forms.patchValue({ idDevice: idDev });
    }
  }

  registrar() {
    if (this.forms.invalid) return;

    this.gService.registrar(this.forms.value).subscribe({
      next: (res) => {
        Swal.fire("Éxito", "Meta de ahorro establecida", "success");
        this.forms.reset({ targetValue: 0, alertThresholdPercentage: 80 });
        this.cambioNivel();
      },
      error: () => Swal.fire("Error", "No se pudo guardar la meta", "error")
    });
  }
}