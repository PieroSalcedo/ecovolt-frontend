import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { CuartoService } from '../../../services/cuarto';
import { ViviendaService } from '../../../services/vivienda';
import { UtilService } from '../../../services/util';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-consulta-cuarto',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule, MatPaginatorModule, MatIconModule, MatButtonModule],
  templateUrl: './consulta-cuarto.html'
})
export class ConsultaCuarto implements OnInit {
  // Filtros
  nombre: string = "";
  idHome: number = -1;
  idTipo: number = -1;
  
  // Listas para los combos del filtro
  viviendas: any[] = [];
  tipos: any[] = [];

  // Configuración de Tabla
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns = ["id", "nombre", "casa", "tipo", "piso", "area", "acciones"];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private cService: CuartoService, 
    private vService: ViviendaService, 
    private util: UtilService,
    private cd: ChangeDetectorRef // VITAL para el error NG0100
  ) {}

  ngOnInit(): void {
    // Cargar combos del buscador
    this.util.getCatalog('TIPO_HABITACION').subscribe(res => {
      this.tipos = res.data || [];
      this.cd.detectChanges();
    });

    this.vService.consultaDinamica("", "", -1).subscribe(res => {
      this.viviendas = res.data || [];
      this.cd.detectChanges();
    });

    this.consultar();
  }

  consultar() {
    // Sincronizado con la URL: ?name=X&idHome=Y&idTipo=Z
    this.cService.consultaDinamica(this.nombre, this.idHome, this.idTipo).subscribe({
      next: (res) => {
        this.dataSource.data = res.data || [];
        this.dataSource.paginator = this.paginator;
        this.cd.detectChanges(); // Elimina el error NG0100
      },
      error: (err) => {
        console.error("Error 400: Revisa que el Backend esté recibiendo 'name', 'idHome' e 'idTipo'", err);
      }
    });
}

  eliminar(id: number, nombre: string) {
    Swal.fire({
      title: '¿Eliminar ambiente?',
      text: `Se borrará: ${nombre}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Sí, borrar'
    }).then(result => {
      if (result.isConfirmed) {
        this.cService.elimina(id).subscribe(res => {
          Swal.fire("Ok", res.message, "success");
          this.consultar();
        });
      }
    });
  }

  actualizar(obj: any) {
    Swal.fire('Info', 'Editar ambiente: ' + obj.name, 'info');
  }
}