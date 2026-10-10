import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Venta, EstadoVenta } from '../../../../models/venta.model';
import { VentaService } from '../../../../core/services/venta';
import { NotificationService } from '../../../../core/services/notification';

@Component({
  selector: 'app-venta-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './venta-list.html',
  styleUrl: './venta-list.css',
})
export class VentaList implements OnInit {
  ventas: Venta[] = [];
  ventaSeleccionada?: Venta;
  filtroEstado: EstadoVenta | '' = '';

  constructor(
    private ventaService: VentaService,
    private notification: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarVentas();
  }

  cargarVentas(): void {
    this.ventaService.getAll().subscribe({
      next: (data) => {
        this.ventas = data;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.notification.error(err?.error?.message ?? 'No se pudieron cargar las ventas.');
      },
    });
  }

  ventasFiltradas(): Venta[] {
    if (!this.filtroEstado) return this.ventas;
    return this.ventas.filter((v) => v.estado === this.filtroEstado);
  }

  verDetalle(venta: Venta): void {
    this.ventaSeleccionada =
      this.ventaSeleccionada?.id === venta.id
        ? undefined
        : venta;

    this.cdr.markForCheck();
  }

  anular(venta: Venta): void {
    if (!confirm(`¿Anular la venta ${venta.numeroVenta}? Esto devolverá el stock de los productos.`)) return;

    this.ventaService.anular(venta.id).subscribe({
      next: () => {
        this.notification.success('Venta anulada correctamente.');
        this.cargarVentas();
      },
      error: (err) => {
        this.notification.error(err?.error?.message ?? 'No se pudo anular la venta.');
      },
    });
  }
}
