import { ChangeDetectorRef,Component, OnInit, ViewChild } from '@angular/core';
import { ViviendaService } from '../../../services/vivienda';
import { UtilService } from '../../../services/util';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-consulta-vivienda',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
],
  templateUrl: './consulta-vivienda.html'
})
export class ConsultaVivienda implements OnInit {
  alias: string = "";
  city: string = "";
  idTipo: number = -1;
  tipos: any[] = [];
  viviendaActualiza: any = null;

  dataSource = new MatTableDataSource<any>();
  displayedColumns = ["id", "alias", "ciudad", "tipo", "tarifa", "area", "acciones"];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private vService: ViviendaService, private util: UtilService,private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.util.listaTipoPropiedad().subscribe(res => {
      this.tipos = res.data || [];
      this.cd.detectChanges();
    });
    this.consultar();
  }

  consultar() {
    this.vService.consultaDinamica(this.alias, this.city, this.idTipo).subscribe(res => {
      this.dataSource.data = res.data || []; 
      this.dataSource.paginator = this.paginator;
      this.cd.detectChanges();
    });
  }

  eliminar(id: number) {
    Swal.fire({ title: '¿Eliminar?', showCancelButton: true }).then(result => {
      if (result.isConfirmed) {
        this.vService.elimina(id).subscribe(() => {
          Swal.fire("Ok", "Eliminado", "success");
          this.consultar();
        });
      }
    });
  }

  actualizar(obj: any) {
    this.viviendaActualiza = {
      idHome: obj.idHome,
      alias: obj.alias,
      city: obj.city,
      address: obj.address,
      energyTariff: obj.energyTariff,
      squareMeters: obj.squareMeters,
      idPropertyType: obj.idPropertyType || -1
    };
  }

  cancelarActualizacion() {
    this.viviendaActualiza = null;
  }

  guardarActualizacion() {
    if (!this.viviendaActualiza) return;

    if (!this.viviendaActualiza.alias || !this.viviendaActualiza.city || !this.viviendaActualiza.address ||
      Number(this.viviendaActualiza.energyTariff) < 0 ||
      Number(this.viviendaActualiza.squareMeters) < 1 ||
      Number(this.viviendaActualiza.idPropertyType) < 1) {
      Swal.fire('Validacion', 'Completa los campos permitidos correctamente.', 'warning');
      return;
    }

    const data = {
      alias: this.viviendaActualiza.alias,
      city: this.viviendaActualiza.city,
      address: this.viviendaActualiza.address,
      energyTariff: Number(this.viviendaActualiza.energyTariff),
      squareMeters: Number(this.viviendaActualiza.squareMeters),
      idPropertyType: Number(this.viviendaActualiza.idPropertyType)
    };

    this.vService.actualiza(this.viviendaActualiza.idHome, data).subscribe({
      next: (res) => {
        Swal.fire('Actualizado', res.message, 'success');
        this.viviendaActualiza = null;
        this.consultar();
      },
      error: (err) => {
        Swal.fire('Error', err.error?.message || 'No se pudo actualizar la vivienda.', 'error');
      }
    });
  }
}
