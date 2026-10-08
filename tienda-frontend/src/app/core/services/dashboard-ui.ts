import { Injectable, signal } from '@angular/core';

// Estado compartido entre header-dashboard y sidebar para poder
// abrir/cerrar el menú lateral en pantallas pequeñas (mobile).
@Injectable({ providedIn: 'root' })
export class DashboardUiService {
  readonly sidebarAbierto = signal(false);

  toggleSidebar(): void {
    this.sidebarAbierto.update((v) => !v);
  }

  cerrarSidebar(): void {
    this.sidebarAbierto.set(false);
  }
}
