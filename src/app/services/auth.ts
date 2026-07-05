import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppSettings } from '../app.settings';
import { LoginUsuario } from '../security/login-usuario.model';
import { JwtDTO } from '../security/jwt-dto.model';
import { ApiResponseDto } from '../models/api-response.model';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private authURL = AppSettings.API_ENDPOINT + '/auth';

  constructor(private httpClient: HttpClient) { }

  public login(loginUsuario: LoginUsuario): Observable<ApiResponseDto<JwtDTO>> {
    return this.httpClient.post<ApiResponseDto<JwtDTO>>(this.authURL + '/login', loginUsuario);
  }

  // --- NUEVO MÉTODO DE REGISTRO ---
  public register(user: User): Observable<ApiResponseDto<User>> {
    return this.httpClient.post<ApiResponseDto<User>>(`${this.authURL}/register`, user);
  }
}