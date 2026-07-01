import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppSettings } from '../app.settings';
import { ApiResponseDto } from '../models/api-response.model';
import { Plan } from '../models/plan.model';

@Injectable({ providedIn: 'root' })
export class PlanService {
  private planURL = AppSettings.API_ENDPOINT + '/plans';

  constructor(private httpClient: HttpClient) { }

  public listaPlanes(): Observable<ApiResponseDto<Plan[]>> {
    return this.httpClient.get<ApiResponseDto<Plan[]>>(this.planURL);
  }
}