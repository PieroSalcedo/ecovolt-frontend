import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppSettings } from '../app.settings';
import { ApiResponseDto } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private baseUrl = AppSettings.API_ENDPOINT + '/users';

  constructor(private http: HttpClient) { }

  upgradePlan(idPlan: number): Observable<ApiResponseDto<any>> {
    return this.http.put<ApiResponseDto<any>>(`${this.baseUrl}/upgrade-plan/${idPlan}`, {});
  }
}