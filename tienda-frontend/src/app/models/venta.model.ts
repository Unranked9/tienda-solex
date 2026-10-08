export type MetodoPago = 'TARJETA' | 'EFECTIVO' | 'YAPE' | 'PLIN' | 'TRANSFERENCIA';
export type EstadoVenta = 'PENDIENTE' | 'PAGADA' | 'ANULADA';

export interface DetalleVenta {
  productoId: number;
  productoNombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface Venta {
  id: number;
  numeroVenta: string;
  clienteNombre: string;
  clienteCorreo: string;
  detalles: DetalleVenta[];
  total: number;
  metodoPago: MetodoPago;
  estado: EstadoVenta;
  fecha: string;
}
export interface DetalleVentaRequest {
  productoId: number;
  cantidad: number;
}

export interface VentaRequest {
  detalles: DetalleVentaRequest[];
  metodoPago: MetodoPago;
}
