import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { DispositivoService } from '../../../services/dispositivo';
import { CuartoService } from '../../../services/cuarto';
import { ViviendaService } from '../../../services/vivienda';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-consulta-dispositivo',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule, MatPaginatorModule, MatIconModule, MatButtonModule],
  templateUrl: './consulta-dispositivo.html'
})
export class ConsultaDispositivo implements OnInit {
  filtroNombre: string = "";
  filtroHome: number = -1;
  filtroRoom: number = -1;

  viviendas: any[] = [];
  cuartos: any[] = [];

  dataSource = new MatTableDataSource<any>([]);
  displayedColumns = ["id", "serial", "nombre", "marca", "ambiente", "acciones"];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private dService: DispositivoService,
    private cService: CuartoService,
    private vService: ViviendaService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.vService.consultaDinamica("", "", -1).subscribe(res => {
      this.viviendas = res.data || [];
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
}