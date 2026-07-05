import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppSettings } from '../app.settings';
import { ApiResponseDto } from '../models/api-response.model';
import { ReporteCasa, ReporteCuarto, ReporteDispositivo } from '../models/reporte.model';

const baseUrl = AppSettings.API_ENDPOINT + '/energy-readings';

@Injectable({ providedIn: 'root' })
export class ReadingService {

  constructor(private http: HttpClient) { }

  // SIMULADOR: Ingesta de datos
  registrarLectura(obj: any): Observable<ApiResponseDto<any>> {
    return this.http.post<ApiResponseDto<any>>(baseUrl, obj);
  }

  // CONSUMO TOTAL POR NIVELES (Lo que hicimos en Java)
  getConsumoCasa(id: number): Observable<ApiResponseDto<number>> {
    return this.http.get<ApiResponseDto<number>>(`${baseUrl}/total/home/${id}`);
  }

  getConsumoCuarto(id: number): Observable<ApiResponseDto<number>> {
    return this.http.get<ApiResponseDto<number>>(`${baseUrl}/total/room/${id}`);
  }

  getConsumoDispositivo(id: number): Observable<ApiResponseDto<number>> {
    return this.http.get<ApiResponseDto<number>>(`${baseUrl}/total/device/${id}`);
  }

  // REPORTES PARA GRÁFICOS
  reporteCasas(): Observable<ReporteCasa[]> {
    return this.http.get<ReporteCasa[]>(`${baseUrl}/reporte/casas`);
  }

  reporteCuartos(idHome: number): Observable<ReporteCuarto[]> {
    return this.http.get<ReporteCuarto[]>(`${baseUrl}/reporte/cuartos/${idHome}`);
  }

  reporteDispositivos(idRoom: number): Observable<ReporteDispositivo[]> {
    return this.http.get<ReporteDispositivo[]>(`${baseUrl}/reporte/dispositivos/${idRoom}`);
  }
}