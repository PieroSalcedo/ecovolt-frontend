import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppSettings } from '../app.settings';
import { ApiResponseDto } from '../models/api-response.model';
import { DataCatalog } from '../models/data-catalog.model';

@Injectable({ providedIn: 'root' })
export class UtilService {
  private baseUrl = AppSettings.API_ENDPOINT + '/utils';

  constructor(private http: HttpClient) { }

  // MÉTODO GENÉRICO: Sirve para TIPO_PROPIEDAD, TIPO_HABITACION, etc.
  public getCatalog(description: string): Observable<ApiResponseDto<DataCatalog[]>> {
    return this.http.get<ApiResponseDto<DataCatalog[]>>(`${this.baseUrl}/catalog/${description}`);
  }

  // Mantén este si lo usas en Vivienda para no romper nada
  public listaTipoPropiedad(): Observable<ApiResponseDto<DataCatalog[]>> {
    return this.getCatalog('TIPO_PROPIEDAD');
  }
}