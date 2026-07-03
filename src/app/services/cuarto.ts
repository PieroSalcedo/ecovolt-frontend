import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppSettings } from '../app.settings';
import { Cuarto } from '../models/cuarto.model';
import { ApiResponseDto } from '../models/api-response.model';

const baseUrl = AppSettings.API_ENDPOINT + "/rooms";

@Injectable({ providedIn: 'root' })
export class CuartoService {

  constructor(private http: HttpClient) { }

  registra(obj: Cuarto): Observable<ApiResponseDto<Cuarto>> {
    return this.http.post<ApiResponseDto<Cuarto>>(baseUrl, obj);
  }

  consultaDinamica(name: string, idHome: number, idTipo: number): Observable<ApiResponseDto<Cuarto[]>> {
    const params = new HttpParams()
      .set('name', name || '')
      .set('idHome', idHome.toString())
      .set('idTipo', idTipo.toString());
      
    return this.http.get<ApiResponseDto<Cuarto[]>>(`${baseUrl}/consultaDinamica`, { params });
}

  elimina(id: number): Observable<ApiResponseDto<void>> {
    return this.http.delete<ApiResponseDto<void>>(`${baseUrl}/${id}`);
  }
}