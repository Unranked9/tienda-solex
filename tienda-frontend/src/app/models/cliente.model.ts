export interface ClienteRequest {
  nombreCompleto: string;
  correo: string;
  telefono?: string;
  direccion?: string;
}

export interface Cliente {
  id: number;
  nombreCompleto: string;
  correo: string;
  telefono?: string;
  direccion?: string;
}