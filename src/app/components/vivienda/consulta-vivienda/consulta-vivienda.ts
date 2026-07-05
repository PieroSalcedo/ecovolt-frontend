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
  textoGeneralPattern = /^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ0-9 ]{2,60}$/;
  soloLetrasPattern = /^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ ]{2,60}$/;
  direccionPattern = /^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ0-9 .,#°/-]{5,120}$/;
  numeroDecimalPattern = /^[0-9]+(\.[0-9]{1,2})?$/;

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
    if ((this.alias && !this.textoGeneralPattern.test(this.alias)) ||
      (this.city && !this.soloLetrasPattern.test(this.city))) {
      Swal.fire('Validacion', 'Revisa los filtros: alias permite letras, numeros y espacios; ciudad solo letras.', 'warning');
      return;
    }

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

    if (!this.textoGeneralPattern.test(this.viviendaActualiza.alias || '') ||
      !this.soloLetrasPattern.test(this.viviendaActualiza.city || '') ||
      !this.direccionPattern.test(this.viviendaActualiza.address || '') ||
      !this.numeroDecimalPattern.test(String(this.viviendaActualiza.energyTariff || '')) ||
      !this.numeroDecimalPattern.test(String(this.viviendaActualiza.squareMeters || '')) ||
      Number(this.viviendaActualiza.squareMeters) < 1 ||
      Number(this.viviendaActualiza.idPropertyType) < 1) {
      Swal.fire('Validacion', 'Completa los campos correctamente. Evita caracteres especiales y usa solo numeros en tarifa y area.', 'warning');
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
