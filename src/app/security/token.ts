import { Injectable } from '@angular/core';
import { Opcion } from '../models/opcion.model';

const TOKEN_KEY = 'AuthToken';
const USERNAME_KEY = 'AuthUserName';
const AUTHORITIES_KEY = 'AuthAuthorities';
const NAME_KEY = 'AuthName';
const USER_ID_KEY = 'AuthUserId';
const OPCIONES_KEY = 'AuthOptions';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  public setToken(token: string): void {
    sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  public setUserName(userName: string): void {
    sessionStorage.setItem(USERNAME_KEY, userName);
  }

  public getUserName(): string | null {
    return sessionStorage.getItem(USERNAME_KEY);
  }

  // ESTE ES EL MÉTODO QUE TE FALTABA
  public setUserNameComplete(name: string): void {
    sessionStorage.setItem(NAME_KEY, name);
  }

  public getUserNameComplete(): string | null {
    return sessionStorage.getItem(NAME_KEY);
  }

  public setAuthorities(authorities: string[]): void {
    sessionStorage.setItem(AUTHORITIES_KEY, JSON.stringify(authorities));
  }

  public getAuthorities(): string[] {
    const auths = sessionStorage.getItem(AUTHORITIES_KEY);
    return auths ? JSON.parse(auths) : [];
  }

  public setOpciones(opciones: Opcion[]): void {
    sessionStorage.removeItem(OPCIONES_KEY);
    sessionStorage.setItem(OPCIONES_KEY, JSON.stringify(opciones));
  }

  public getOpciones(): Opcion[] {
    const opcs = sessionStorage.getItem(OPCIONES_KEY);
    if (opcs) {
      return JSON.parse(opcs);
    }
    return [];
  }


  public logOut(): void {
    sessionStorage.clear();
  }
}