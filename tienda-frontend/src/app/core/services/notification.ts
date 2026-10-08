import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private nextId = 1;
  readonly toasts = signal<Toast[]>([]);

  success(message: string, duracionMs = 4000): void {
    this.mostrar('success', message, duracionMs);
  }

  error(message: string, duracionMs = 5500): void {
    this.mostrar('error', message, duracionMs);
  }

  info(message: string, duracionMs = 4000): void {
    this.mostrar('info', message, duracionMs);
  }

  warning(message: string, duracionMs = 5000): void {
    this.mostrar('warning', message, duracionMs);
  }

  cerrar(id: number): void {
    this.toasts.update((lista) => lista.filter((t) => t.id !== id));
  }

  private mostrar(type: ToastType, message: string, duracionMs: number): void {
    const id = this.nextId++;
    this.toasts.update((lista) => [...lista, { id, type, message }]);

    if (duracionMs > 0) {
      setTimeout(() => this.cerrar(id), duracionMs);
    }
  }
}
