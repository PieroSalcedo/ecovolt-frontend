import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppSettings } from '../app.settings';
import { ApiResponseDto } from '../models/api-response.model';
import { EnergyAdvisorRequest, EnergyAdvisorResponse } from '../models/advisor.model';

const baseUrl = AppSettings.API_ENDPOINT + "/advisor";

@Injectable({ providedIn: 'root' })
export class AdvisorService {

  constructor(private http: HttpClient) { }

  analizar(obj: EnergyAdvisorRequest): Observable<ApiResponseDto<EnergyAdvisorResponse>> {
    return this.http.post<ApiResponseDto<EnergyAdvisorResponse>>(`${baseUrl}/analyze`, obj);
  }
}
