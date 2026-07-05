import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppSettings } from '../app.settings';
import { Vivienda } from '../models/vivienda.model';
import { ApiResponseDto } from '../models/api-response.model';

const baseUrl = AppSettings.API_ENDPOINT + "/homes";

@Injectable({ providedIn: 'root' })
export class ViviendaService {
  constructor(private http: HttpClient) { }

  registra(obj: Vivienda): Observable<ApiResponseDto<Vivienda>> {
    return this.http.post<ApiResponseDto<Vivienda>>(baseUrl + "/registra", obj);
  }

  consultaDinamica(alias: string, city: string, idTipo: number): Observable<ApiResponseDto<Vivienda[]>> {
    const params = new HttpParams()
      .set('alias', alias)
      .set('city', city)
      .set('idTipo', idTipo.toString());
    return this.http.get<ApiResponseDto<Vivienda[]>>(baseUrl + "/consultaDinamica", { params });
  }

  elimina(id: number): Observable<ApiResponseDto<any>> {
    return this.http.delete<ApiResponseDto<any>>(`${baseUrl}/elimina/${id}`);
  }

  actualiza(id: number, obj: Vivienda): Observable<ApiResponseDto<Vivienda>> {
    return this.http.put<ApiResponseDto<Vivienda>>(`${baseUrl}/${id}`, obj);
  }
}
