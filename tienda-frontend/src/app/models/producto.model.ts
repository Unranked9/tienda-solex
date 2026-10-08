export interface ProductoRequest {
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  categoriaId: number;
}

export interface Producto {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  imagenUrl?: string;
  activo: boolean;
  categoriaId: number;
  categoriaNombre?: string;
}