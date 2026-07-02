import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Vivienda } from '../../models/vivienda.model';
import { DataCatalog } from '../../models/data-catalog.model';
import { UtilService } from '../../services/util';
import { ViviendaService } from '../../services/vivienda';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vivienda-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  templateUrl: './vivienda-modal.html'
})
export class ViviendaModalComponent implements OnInit {

  vivienda: Vivienda = new Vivienda();
  tipos: DataCatalog[] = [];

  constructor(
    public dialogRef: MatDialogRef<ViviendaModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Vivienda,
    private utilService: UtilService,
    private viviendaService: ViviendaService
  ) {
    if (data) this.vivienda = { ...data }; // Si hay data, es editar
  }

  ngOnInit(): void {
    this.utilService.listaTipoPropiedad().subscribe(res => this.tipos = res.data);
  }

  guardar() {
    if (this.vivienda.idHome) {
      this.viviendaService.actualiza(this.vivienda).subscribe(res => {
        Swal.fire('Éxito', res.message, 'success');
        this.dialogRef.close(true);
      });
    } else {
      this.viviendaService.registra(this.vivienda).subscribe(res => {
        Swal.fire('Registrado', res.message, 'success');
        this.dialogRef.close(true);
      });
    }
  }
}