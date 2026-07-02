import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ViviendaService } from '../../services/vivienda';
import { UtilService } from '../../services/util';
import { Vivienda } from '../../models/vivienda.model';
import { DataCatalog } from '../../models/data-catalog.model';
import Swal from 'sweetalert2';
import { ViviendaModalComponent } from '../vivienda-modal/vivienda-modal';

@Component({
  selector: 'app-vivienda',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule, MatPaginatorModule, MatDialogModule, MatIconModule, MatButtonModule, MatInputModule, MatSelectModule],
  templateUrl: './vivienda.html'
})
export class ViviendaComponent implements OnInit {

  // Filtros para consulta dinámica
  alias: string = "";
  city: string = "";
  idTipo: number = -1;
  tipos: DataCatalog[] = [];

  // Configuración de Tabla
  dataSource = new MatTableDataSource<Vivienda>();
  displayedColumns = ['idHome', 'alias', 'address', 'city', 'acciones'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private viviendaService: ViviendaService, 
    private utilService: UtilService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.utilService.listaTipoPropiedad().subscribe(res => this.tipos = res.data);
    this.consultar();
  }

  // Se ejecuta en cada teclazo (keyup)
  consultar() {
    this.viviendaService.consultaDinamica(this.alias, this.city, this.idTipo)
      .subscribe(res => {
        this.dataSource.data = res.data;
        this.dataSource.paginator = this.paginator;
      });
  }

  eliminar(obj: Vivienda) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Eliminarás la vivienda: ${obj.alias}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2d6a4f',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.viviendaService.elimina(obj.idHome!).subscribe(res => {
          Swal.fire('Eliminado', res.message, 'success');
          this.consultar();
        });
      }
    });
  }

  openModal(obj?: Vivienda) {
    const dialogRef = this.dialog.open(ViviendaModalComponent, {
      width: '600px',
      data: obj // Si viene obj es edición, si no es registro
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.consultar();
    });
  }
}