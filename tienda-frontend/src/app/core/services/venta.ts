import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  Venta,
  VentaRequest
} from '../../models/venta.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  private baseUrl =
    `${environment.apiUrl}/api/v1/ventas`;

  constructor(
    private http: HttpClient
  ) {}

  getAll(): Observable<Venta[]> {

    return this.http.get<Venta[]>(
      this.baseUrl
    );
  }

  getById(id: number): Observable<Venta> {

    return this.http.get<Venta>(
      `${this.baseUrl}/${id}`
    );
  }

  crear(request: VentaRequest): Observable<Venta> {

    return this.http.post<Venta>(
      this.baseUrl,
      request
    );
  }

  misCompras(): Observable<Venta[]> {

    return this.http.get<Venta[]>(
      `${this.baseUrl}/mis-compras`
    );
  }

  anular(id: number): Observable<Venta> {

    return this.http.patch<Venta>(
      `${this.baseUrl}/${id}/anular`,
      {}
    );
  }
}