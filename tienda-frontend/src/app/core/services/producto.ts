import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto, ProductoRequest } from '../../models/producto.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private baseUrl = `${environment.apiUrl}/api/v1/productos`;

  constructor(private http: HttpClient) {}

  getAll(categoriaId?: number): Observable<Producto[]> {
    let params = new HttpParams();
    if (categoriaId != null) {
      params = params.set('categoriaId', categoriaId);
    }
    return this.http.get<Producto[]>(this.baseUrl, { params });
  }

  getById(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.baseUrl}/${id}`);
  }

  create(producto: ProductoRequest): Observable<Producto> {
    return this.http.post<Producto>(this.baseUrl, producto);
  }

  update(id: number, producto: ProductoRequest): Observable<Producto> {
    return this.http.put<Producto>(`${this.baseUrl}/${id}`, producto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  actualizarImagen(id: number, imagen: File): Observable<Producto> {
    const formData = new FormData();
    formData.append('imagen', imagen);
    return this.http.post<Producto>(`${this.baseUrl}/${id}/imagen`, formData);
  }
}