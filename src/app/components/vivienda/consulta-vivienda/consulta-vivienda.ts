import { ChangeDetectorRef,Component, OnInit, ViewChild } from '@angular/core';
import { ViviendaService } from '../../../services/vivienda';
import { UtilService } from '../../../services/util';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
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
}