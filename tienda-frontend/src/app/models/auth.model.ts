export interface LoginResponse {
  token: string;
  tipo: string;
  correo: string;
  rol: string;
}

export interface UsuarioResponse {
  id: number;
  correo: string;
  rol: string;
}
