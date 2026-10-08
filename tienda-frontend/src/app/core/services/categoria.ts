import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria, CategoriaRequest } from '../../models/categoria.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private baseUrl = `${environment.apiUrl}/api/v1/categorias`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.baseUrl);
  }

  getById(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.baseUrl}/${id}`);
  }

  create(categoria: CategoriaRequest): Observable<Categoria> {
    return this.http.post<Categoria>(this.baseUrl, categoria);
  }

  update(id: number, categoria: CategoriaRequest): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.baseUrl}/${id}`, categoria);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}