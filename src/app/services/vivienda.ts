import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppSettings } from '../app.settings';
import { ApiResponseDto } from '../models/api-response.model';
import { Vivienda } from '../models/vivienda.model';

@Injectable({ providedIn: 'root' })
export class ViviendaService {
  private baseUrl = AppSettings.API_ENDPOINT + '/homes';

  constructor(private http: HttpClient) { }

  // Consulta Dinámica (Estilo Jacinto)
  consultaDinamica(alias: string, city: string, idTipo: number): Observable<ApiResponseDto<Vivienda[]>> {
    const params = new HttpParams()
      .set('alias', alias)
      .set('city', city)
      .set('idTipo', idTipo.toString());
    return this.http.get<ApiResponseDto<Vivienda[]>>(this.baseUrl + '/consultaDinamica', { params });
  }

  registra(obj: Vivienda): Observable<ApiResponseDto<Vivienda>> {
    return this.http.post<ApiResponseDto<Vivienda>>(this.baseUrl, obj);
  }

  actualiza(obj: Vivienda): Observable<ApiResponseDto<Vivienda>> {
    return this.http.put<ApiResponseDto<Vivienda>>(`${this.baseUrl}/${obj.idHome}`, obj);
  }

  elimina(id: number): Observable<ApiResponseDto<void>> {
    return this.http.delete<ApiResponseDto<void>>(`${this.baseUrl}/${id}`);
  }
}