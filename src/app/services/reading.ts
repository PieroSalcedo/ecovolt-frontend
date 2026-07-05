import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppSettings } from '../app.settings';
import { ApiResponseDto } from '../models/api-response.model';

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
}