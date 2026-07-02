import { Injectable } from '@angular/core';
import { Option } from '../models/option.models';

const TOKEN_KEY = 'AuthToken';
const USERNAME_KEY = 'AuthUserName';
const AUTHORITIES_KEY = 'AuthAuthorities';
const NAME_KEY = 'AuthName';
const USER_ID_KEY = 'AuthUserId'; // Asegúrate de que esta constante esté
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

  // MÉTODO PARA GUARDAR EL ID
  public setUserId(id: string): void {
    sessionStorage.setItem(USER_ID_KEY, id);
  }

  // ESTE ES EL MÉTODO QUE TE FALTABA
  public getUserId(): string | null {
    return sessionStorage.getItem(USER_ID_KEY);
  }

  public setUserName(userName: string): void {
    sessionStorage.setItem(USERNAME_KEY, userName);
  }

  public getUserName(): string | null {
    return sessionStorage.getItem(USERNAME_KEY);
  }

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

  public setOpciones(opciones: Option[]): void {
    sessionStorage.setItem(OPCIONES_KEY, JSON.stringify(opciones));
  }

  public getOpciones(): Option[] {
    const opcs = sessionStorage.getItem(OPCIONES_KEY);
    return opcs ? JSON.parse(opcs) : [];
  }

  public logOut(): void {
    sessionStorage.clear();
  }
}