import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppSettings } from '../app.settings';
import { ApiResponseDto } from '../models/api-response.model';
import { ReporteCasa, ReporteCuarto, ReporteDispositivo } from '../models/reporte.model';

// Definimos la base URL para lecturas
const baseUrl = AppSettings.API_ENDPOINT + '/energy-readings';

@Injectable({ providedIn: 'root' })
export class ReadingService {

  constructor(private http: HttpClient) { }

  // === ESTE ES EL MÉTODO QUE TE FALTABA PARA EL SIMULADOR ===
  registrarLectura(obj: any): Observable<ApiResponseDto<any>> {
    return this.http.post<ApiResponseDto<any>>(baseUrl, obj);
  }

  // Los métodos de reporte que ya agregamos antes
  reporteCasas(): Observable<ReporteCasa[]> {
    return this.http.get<ReporteCasa[]>(`${baseUrl}/reporte/casas`);
  }

  reporteCuartos(idHome: number): Observable<ReporteCuarto[]> {
    return this.http.get<ReporteCuarto[]>(`${baseUrl}/reporte/cuartos/${idHome}`);
  }

  reporteDispositivos(idRoom: number): Observable<ReporteDispositivo[]> {
    return this.http.get<ReporteDispositivo[]>(`${baseUrl}/reporte/dispositivos/${idRoom}`);
  }

  // Método para el consumo total del mes
  getConsumoTotal(idHome: number, start: string, end: string): Observable<ApiResponseDto<number>> {
    const params = new HttpParams().set('start', start).set('end', end);
    return this.http.get<ApiResponseDto<number>>(`${baseUrl}/home/${idHome}/total`, { params });
  }
}