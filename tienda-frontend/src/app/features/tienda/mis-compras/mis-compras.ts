import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { VentaService } from '../../../core/services/venta';
import { Venta } from '../../../models/venta.model';

@Component({
  selector: 'app-mis-compras',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './mis-compras.html',
  styleUrl: './mis-compras.css',
})
export class MisCompras implements OnInit {

  private readonly ventaService = inject(VentaService);

  readonly ventas = signal<Venta[]>([]);
  readonly cargando = signal(true);
  readonly expandidoId = signal<number | null>(null);

  ngOnInit(): void {

    this.ventaService.misCompras().subscribe({

      next: (ventas) => {
        this.ventas.set(ventas);
        this.cargando.set(false);
      },

      error: () => {
        this.cargando.set(false);
      }

    });
  }

  toggleDetalle(ventaId: number): void {

    this.expandidoId.update(
      actual => actual === ventaId ? null : ventaId
    );
  }

  claseBadge(estado: string): string {

    if (estado === 'PAGADA') {
      return 'badge-ok';
    }

    if (estado === 'PENDIENTE') {
      return 'badge-pendiente';
    }

    return 'badge-cancelado';
  }
}
