import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppSettings } from '../app.settings';
import { ApiResponseDto } from '../models/api-response.model';
import { Meta } from '../models/meta.model';

@Injectable({ providedIn: 'root' })
export class GoalService {
  private baseUrl = AppSettings.API_ENDPOINT + '/energy-goals';

  constructor(private http: HttpClient) { }

  registrar(obj: Meta): Observable<ApiResponseDto<Meta>> {
    return this.http.post<ApiResponseDto<Meta>>(this.baseUrl, obj);
  }

  // Lista metas según el nivel y el ID
  listarActiva(tipo: string, id: number): Observable<ApiResponseDto<Meta[]>> {
    // Usamos el endpoint del backend que filtra por casa/cuarto/dispositivo
    return this.http.get<ApiResponseDto<Meta[]>>(`${this.baseUrl}/active?type=${tipo}&id=${id}`);
  }

  eliminar(id: number): Observable<ApiResponseDto<void>> {
    return this.http.delete<ApiResponseDto<void>>(`${this.baseUrl}/${id}`);
  }

  obtenerMetaActiva(type: string, id: number): Observable<ApiResponseDto<Meta>> {
    return this.http.get<ApiResponseDto<Meta>>(`${this.baseUrl}/active-by-type?type=${type}&id=${id}`);
  }
}