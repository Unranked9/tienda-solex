import { Component, HostListener, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { Carrito } from '../../core/services/carrito';
import { CommonModule } from '@angular/common';
import { Auth } from '../../core/services/auth';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header-tienda',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header-tienda.html',
  styleUrl: './header-tienda.css',
})
export class HeaderTienda {
  private readonly authService = inject(Auth);
  private readonly router = inject(Router);

  // Signals: en zoneless change detection se refleja el estado en la vista
  // sin depender de zone.js ni de llamadas manuales a markForCheck().
  readonly menuAbierto = signal(false);
  readonly conScroll = signal(false);

  constructor(public carrito: Carrito) {
    // Cierra el menú móvil automáticamente al navegar a otra ruta.
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => this.menuAbierto.set(false));
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.conScroll.set(window.scrollY > 12);
  }

  toggleMenu(): void {
    this.menuAbierto.update((v) => !v);
  }

  cerrarMenu(): void {
    this.menuAbierto.set(false);
  }

  estaAutenticado(): boolean {
    return this.authService.estaAutenticado();
  }

  esAdmin(): boolean {
    const rol = this.authService.getRol();
    return rol === 'ROLE_ADMIN' || rol === 'ROLE_EMPLEADO';
  }

  logout(): void {
    this.menuAbierto.set(false);
    this.authService.logout();
  }
}
