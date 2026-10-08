import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { Carrito as CarritoService } from '../../../core/services/carrito';
import { VentaService } from '../../../core/services/venta';
import { NotificationService } from '../../../core/services/notification';
import { environment } from '../../../../environments/environment';
import { PRODUCTO_PLACEHOLDER, manejarErrorImagenProducto } from '../../../shared/utils/imagen.util';
import {
  MetodoPago,
  VentaRequest
} from '../../../models/venta.model';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css',
})
export class Carrito {

  fileBaseUrl = environment.apiUrl;
  placeholderImg = PRODUCTO_PLACEHOLDER;
  onImgError = manejarErrorImagenProducto;

  metodoPago: MetodoPago = 'YAPE';

  procesandoVenta = false;

  mensajeError = '';

  constructor(
    public carritoService: CarritoService,
    private ventaService: VentaService,
    private router: Router,
    private notification: NotificationService
  ) {}

  aumentar(
    productoId: number,
    cantidadActual: number
  ): void {

    this.carritoService.actualizarCantidad(
      productoId,
      cantidadActual + 1
    );
  }

  disminuir(
    productoId: number,
    cantidadActual: number
  ): void {

    if (cantidadActual <= 1) {
      return;
    }

    this.carritoService.actualizarCantidad(
      productoId,
      cantidadActual - 1
    );
  }

  eliminar(productoId: number): void {
    this.carritoService.eliminar(productoId);
  }

  procesarVenta(): void {

    const items = this.carritoService.itemsCarrito();

    if (items.length === 0) {
      return;
    }

    this.procesandoVenta = true;
    this.mensajeError = '';

    const request: VentaRequest = {

      detalles: items.map(item => ({
        productoId: item.productoId,
        cantidad: item.cantidad
      })),

      metodoPago: this.metodoPago
    };

    this.ventaService.crear(request).subscribe({

      next: (venta) => {

        // Vaciar carrito después de crear correctamente la venta
        this.carritoService.vaciar();

        this.procesandoVenta = false;

        // Mensaje emergente de confirmación de compra.
        this.notification.success('¡Compra realizada con éxito! Gracias por tu pedido.');

        this.router.navigate(['/mis-compras']);

      },

      error: (error) => {

        const mensaje =
          error.error?.message ||
          'No se pudo procesar la venta';

        this.mensajeError = mensaje;
        this.notification.error(mensaje);
        this.procesandoVenta = false;
      }

    });
  }
}