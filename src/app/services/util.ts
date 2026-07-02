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

  public listaTipoPropiedad(): Observable<ApiResponseDto<DataCatalog[]>> {
    // Debe ser 'TIPO_PROPIEDAD' porque así lo pusimos en el script SQL
    return this.http.get<ApiResponseDto<DataCatalog[]>>(`${this.baseUrl}/catalog/TIPO_PROPIEDAD`);
}
}