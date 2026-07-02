import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppSettings } from '../app.settings';
import { ApiResponseDto } from '../models/api-response.model';
import { DataCatalog } from '../models/data-catalog.model';

@Injectable({ providedIn: 'root' })
export class UtilService {
  constructor(private http: HttpClient) { }

  listaTipoPropiedad(): Observable<ApiResponseDto<DataCatalog[]>> {
    return this.http.get<ApiResponseDto<DataCatalog[]>>(AppSettings.API_ENDPOINT + '/utils/catalog/TIPO_PROPIEDAD');
  }
}