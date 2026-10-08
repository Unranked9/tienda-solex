import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { Carrito } from './carrito';
import { LoginResponse, UsuarioResponse } from '../../models/auth.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Auth {

  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly carrito = inject(Carrito);

  private readonly loginUrl = `${environment.apiUrl}/api/v1/auth/login`;
  private readonly registroUrl = `${environment.apiUrl}/api/v1/auth/registro`;
  private readonly tokenKey = 'authtoken';

  login(correo: string, contrasena: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.loginUrl, { correo, contrasena }).pipe(
      tap(response => {
        if (response.token) {
          this.setToken(response.token);
        }
      })
    );
  }

  registrar(nombreCompleto: string, correo: string, contrasena: string): Observable<UsuarioResponse> {
    return this.http.post<UsuarioResponse>(this.registroUrl, {
      nombreCompleto,
      correo,
      contrasena,
    });
  }

  logout(): void {
    this.carrito.vaciar();
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  estaAutenticado(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiracion = payload.exp * 1000;
      return Date.now() < expiracion;
    } catch {
      // Token corrupto o mal formado: se trata como no autenticado.
      return false;
    }
  }

  getRol(): string | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.roles?.[0]?.authority ?? null;
    } catch {
      return null;
    }
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }
}
