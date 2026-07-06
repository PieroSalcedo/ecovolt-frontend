import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { DispositivoService } from '../../../services/dispositivo';
import { CuartoService } from '../../../services/cuarto';
import { ViviendaService } from '../../../services/vivienda';
import { UtilService } from '../../../services/util';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-consulta-dispositivo',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule, MatPaginatorModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './consulta-dispositivo.html'
})
export class ConsultaDispositivo implements OnInit {
  filtroNombre: string = "";
  filtroHome: number = -1;
  filtroRoom: number = -1;

  viviendas: any[] = [];
  cuartos: any[] = [];
  categorias: any[] = [];
  habitacionesActualiza: any[] = [];
  dispositivoActualiza: any = null;

  dataSource = new MatTableDataSource<any>([]);
  displayedColumns = ["id", "serial", "nombre", "marca", "ambiente","estado", "acciones"];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private dService: DispositivoService,
    private cService: CuartoService,
    private vService: ViviendaService,
    private utilService: UtilService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.vService.consultaDinamica("", "", -1).subscribe(res => {
      this.viviendas = res.data || [];
      this.cd.detectChanges();
    });
    this.utilService.getCatalog('CATEGORIA_DISPOSITIVO').subscribe(res => {
      this.categorias = res.data || [];
      this.cd.detectChanges();
    });
    this.consultar();
  }

  onHomeFilterChange(homeId: number) {
    this.filtroRoom = -1;
    this.cuartos = [];
    if (homeId > 0) {
      this.cService.consultaDinamica("", homeId, -1).subscribe(res => {
        this.cuartos = res.data || [];
        this.cd.detectChanges();
      });
    }
  }

  consultar() {
    this.dService.consultaDinamica(this.filtroHome, this.filtroRoom, this.filtroNombre).subscribe({
      next: (res) => {
        this.dataSource.data = res.data || [];
        this.dataSource.paginator = this.paginator;
        this.cd.detectChanges();
      }
    });
  }

  eliminar(id: number, nombre: string) {
    Swal.fire({
      title: '¿Desvincular?',
      text: `Se borrará: ${nombre}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Sí, borrar'
    }).then(result => {
      if (result.isConfirmed) {
        this.dService.elimina(id).subscribe(() => {
          Swal.fire("Ok", "Eliminado", "success");
          this.consultar();
        });
      }
    });
  }

  actualizar(obj: any) {
    this.cService.consultaDinamica("", -1, -1).subscribe({
      next: (roomRes) => {
        this.habitacionesActualiza = roomRes.data || [];
        this.dispositivoActualiza = {
          idDevice: obj.idDevice,
          name: obj.name,
          brand: obj.brand,
          serialNumber: obj.serialNumber,
          idRoom: obj.idRoom || -1,
          idCategory: obj.idCategory || -1
        };
        this.cd.detectChanges();
      },
      error: (err) => {
        Swal.fire('Error', err.error?.message || 'No se pudieron cargar las habitaciones.', 'error');
      }
    });
  }

  cancelarActualizacion() {
    this.dispositivoActualiza = null;
  }

  guardarActualizacion() {
    if (!this.dispositivoActualiza) return;

    if (!this.dispositivoActualiza.name || !this.dispositivoActualiza.brand ||
      Number(this.dispositivoActualiza.idRoom) < 1 ||
      Number(this.dispositivoActualiza.idCategory) < 1) {
      Swal.fire('Validacion', 'Completa los campos permitidos correctamente.', 'warning');
      return;
    }

    const data = {
      name: this.dispositivoActualiza.name,
      brand: this.dispositivoActualiza.brand,
      idRoom: Number(this.dispositivoActualiza.idRoom),
      idCategory: Number(this.dispositivoActualiza.idCategory)
    };

    this.dService.actualiza(this.dispositivoActualiza.idDevice, data).subscribe({
      next: (res) => {
        Swal.fire('Actualizado', res.message, 'success');
        this.dispositivoActualiza = null;
        this.consultar();
      },
      error: (err) => {
        Swal.fire('Error', err.error?.message || 'No se pudo actualizar el dispositivo.', 'error');
      }
    });
  }
  cambiarEstado(x: any) {
  this.dService.cambiarEstado(x.idDevice).subscribe({
    next: (res) => {
      if (res.data) {
        x.isOn = res.data.onOff;
      }

      Swal.fire({
        title: 'Estado actualizado',
        text: res.message,
        icon: 'success',
        timer: 1200,
        showConfirmButton: false
      });
    },
    error: (err) => {
      Swal.fire('Error', err.error?.message || 'No se pudo cambiar el estado del dispositivo.', 'error');
     }
    });
  }
}