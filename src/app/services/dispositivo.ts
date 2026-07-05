import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppSettings } from '../app.settings';
import { Dispositivo } from '../models/dispositivo.model';
import { ApiResponseDto } from '../models/api-response.model';

const baseUrl = AppSettings.API_ENDPOINT + "/devices";

@Injectable({ providedIn: 'root' })
export class DispositivoService {

  constructor(private http: HttpClient) { }

  registra(obj: Dispositivo): Observable<ApiResponseDto<Dispositivo>> {
    return this.http.post<ApiResponseDto<Dispositivo>>(baseUrl, obj);
  }

  listarMisDispositivos(): Observable<ApiResponseDto<Dispositivo[]>> {
    // URL limpia sin parámetros extra
    return this.http.get<ApiResponseDto<Dispositivo[]>>(`${baseUrl}/mis-dispositivos`);
  }

  consultaDinamica(idHome: number, idRoom: number, name: string): Observable<ApiResponseDto<Dispositivo[]>> {
    const params = new HttpParams()
      .set('idHome', idHome.toString())
      .set('idRoom', idRoom.toString())
      .set('name', name || '');
      
    return this.http.get<ApiResponseDto<Dispositivo[]>>(`${baseUrl}/consultaDinamica`, { params });
  }

  elimina(id: number): Observable<ApiResponseDto<void>> {
    return this.http.delete<ApiResponseDto<void>>(`${baseUrl}/${id}`);
  }

  actualiza(id: number, obj: Dispositivo): Observable<ApiResponseDto<Dispositivo>> {
    return this.http.put<ApiResponseDto<Dispositivo>>(`${baseUrl}/${id}`, obj);
  }
}
