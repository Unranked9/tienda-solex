import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Venta } from '../../../../models/venta.model';
import { VentaService } from '../../../../core/services/venta';

@Component({
  selector: 'app-venta-list',
  imports: [CommonModule],
  templateUrl: './venta-list.html',
  styleUrl: './venta-list.css',
})
export class VentaList implements OnInit {
  ventas: Venta[] = [];
  ventaSeleccionada?: Venta;

  constructor(
    private ventaService: VentaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.ventaService.getAll().subscribe({
      next: (data) => {
        this.ventas = data;
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Error al cargar ventas', err),
    });
  }

  verDetalle(venta: Venta): void {
    this.ventaSeleccionada =
      this.ventaSeleccionada?.id === venta.id
        ? undefined
        : venta;

    this.cdr.markForCheck();
  }
}
