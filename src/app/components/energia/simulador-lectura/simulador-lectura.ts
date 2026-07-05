import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DispositivoService } from '../../../services/dispositivo';
import { ReadingService } from '../../../services/reading';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import Swal from 'sweetalert2';
import { MatToolbar } from "@angular/material/toolbar";

@Component({
  selector: 'app-simulador-lectura',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatToolbar],
  templateUrl: './simulador-lectura.html'
})
export class SimuladorLectura implements OnInit {
  forms: FormGroup;
  dispositivos: any[] = [];

  constructor(private fb: FormBuilder, private dService: DispositivoService, private rService: ReadingService,private cd: ChangeDetectorRef) {
    this.forms = this.fb.group({
      idDevice: [-1, [Validators.required, Validators.min(1)]],
      wattage: [0, [Validators.required, Validators.min(0.1)]],
      voltage: [220, Validators.required]
    });
  }

  ngOnInit(): void {
    this.dService.listarMisDispositivos().subscribe({
      next: (res) => {
        this.dispositivos = res.data || [];
        this.cd.detectChanges(); // Para que el combo se llene visualmente
      },
      error: (err) => {
        console.error("Error 400 detectado:", err);
        Swal.fire("Error", "No se pudieron cargar tus equipos. Revisa la consola del backend.", "error");
      }
    });
  }

  enviarTelemetria() {
    this.rService.registrarLectura(this.forms.value).subscribe(res => {
      Swal.fire({
        title: '¡Dato Enviado!',
        text: 'La lectura se ha inyectado en el historial.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
      // No reseteamos todo para poder enviar varios seguidos fácilmente
      this.forms.patchValue({ wattage: 0 }); 
    });
  }
}