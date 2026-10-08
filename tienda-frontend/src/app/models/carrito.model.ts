export interface ItemCarrito {
  productoId: number;
  nombre: string;
  precio: number;
  cantidad: number;
  imagenUrl?: string;
  stockDisponible: number;
}