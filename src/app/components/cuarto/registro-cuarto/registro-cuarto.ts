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
  textoGeneralPattern = /^(?=.*[A-Za-z\u00C0-\u017F])[A-Za-z\u00C0-\u017F0-9 ]{2,60}$/;
  soloLetrasPattern = /^$|^(?=.*[A-Za-z\u00C0-\u017F])[A-Za-z\u00C0-\u017F ]{2,60}$/;
  numeroEnteroPattern = /^[0-9]+$/;
  numeroDecimalPattern = /^[0-9]+(\.[0-9]{1,2})?$/;

  constructor(
    private fb: FormBuilder,
    private util: UtilService,
    private vService: ViviendaService,
    private cService: CuartoService
  ) {
    this.forms = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(this.textoGeneralPattern)]],
      orientation: ['', Validators.pattern(this.soloLetrasPattern)],
      floorNumber: [1, [Validators.required, Validators.min(0), Validators.pattern(this.numeroEnteroPattern)]],
      areaSqm: [0, [Validators.required, Validators.min(1), Validators.pattern(this.numeroDecimalPattern)]],
      idRoomType: [-1, [Validators.required, Validators.min(1)]],
      idHome: [-1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.util.getCatalog('TIPO_HABITACION').subscribe(res => this.tipos = res.data || []);
    this.vService.consultaDinamica("", "", -1).subscribe(res => this.viviendas = res.data || []);
  }

  registrar() {
    if (this.forms.invalid) {
      this.forms.markAllAsTouched();
      Swal.fire('Datos incorrectos', 'Revisa los campos marcados antes de guardar el ambiente.', 'warning');
      return;
    }

    const data = {
      ...this.forms.value,
      floorNumber: Number(this.forms.value.floorNumber),
      areaSqm: Number(this.forms.value.areaSqm)
    };

    this.cService.registra(data).subscribe(res => {
      Swal.fire("Exito", res.message, "success");
      this.forms.reset({ floorNumber: 1, areaSqm: 0, idRoomType: -1, idHome: -1 });
    });
  }
}
