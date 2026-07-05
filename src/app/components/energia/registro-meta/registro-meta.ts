import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { GoalService } from '../../../services/goal';
import { ViviendaService } from '../../../services/vivienda';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import Swal from 'sweetalert2';
import { MatToolbar } from "@angular/material/toolbar";
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-registro-meta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatToolbar, MatIcon],
  templateUrl: './registro-meta.html'
})
export class RegistroMeta implements OnInit {
  forms: FormGroup;
  viviendas: any[] = [];

  constructor(private fb: FormBuilder, private gService: GoalService, private vService: ViviendaService) {
    this.forms = this.fb.group({
      idHome: [-1, [Validators.required, Validators.min(1)]],
      targetValue: [0, [Validators.required, Validators.min(1)]],
      alertThresholdPercentage: [80, [Validators.required, Validators.min(1), Validators.max(100)]]
    });
  }

  ngOnInit(): void {
    // Filtro básico para traer las viviendas del usuario
    this.vService.consultaDinamica("", "", -1).subscribe(res => this.viviendas = res.data || []);
  }

  registrar() {
    this.gService.registrar(this.forms.value).subscribe(res => {
      Swal.fire("Meta Creada", res.message, "success");
      this.forms.reset({ idHome: -1, targetValue: 0, alertThresholdPercentage: 80 });
    });
  }
}