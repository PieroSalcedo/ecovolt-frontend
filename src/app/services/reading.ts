import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppSettings } from '../app.settings';
import { ApiResponseDto } from '../models/api-response.model';
import { ReporteCasa } from '../models/reporte-casa.model';
import { ReporteCuarto } from '../models/reporte-cuarto.model';
import { ReporteDispositivo } from '../models/reporte-dispositivo.model';

@Injectable({ providedIn: 'root' })
export class ReadingService {
  private baseUrl = AppSettings.API_ENDPOINT + '/energy-readings';

  constructor(private http: HttpClient) { }

  // Envía una lectura (Ingesta)
  registrarLectura(obj: any): Observable<ApiResponseDto<any>> {
    return this.http.post<ApiResponseDto<any>>(this.baseUrl, obj);
  }

  // Calcula consumo total (Requiere fechas en formato ISO)
  getConsumoTotal(idHome: number, start: string, end: string): Observable<ApiResponseDto<number>> {
    const params = new HttpParams().set('start', start).set('end', end);
    return this.http.get<ApiResponseDto<number>>(`${this.baseUrl}/home/${idHome}/total`, { params });
  }

  graficoConsumoPorCasa(): Observable<ReporteCasa[]> {
    return this.http.get<ReporteCasa[]>(`${this.baseUrl}/reporte/casas`);
  }

  graficoConsumoPorCuarto(idHome: number): Observable<ReporteCuarto[]> {
    return this.http.get<ReporteCuarto[]>(`${this.baseUrl}/reporte/cuartos/${idHome}`);
  }

  graficoConsumoPorDispositivo(idRoom: number): Observable<ReporteDispositivo[]> {
    return this.http.get<ReporteDispositivo[]>(`${this.baseUrl}/reporte/dispositivos/${idRoom}`);
  }
}
