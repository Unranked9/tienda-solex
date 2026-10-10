import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Producto } from '../../../../models/producto.model';
import { ProductoService } from '../../../../core/services/producto';
import { environment } from '../../../../../environments/environment';
import { PRODUCTO_PLACEHOLDER, manejarErrorImagenProducto } from '../../../../shared/utils/imagen.util';
import { NotificationService } from '../../../../core/services/notification';

@Component({
  selector: 'app-producto-list',
  imports: [RouterLink, CommonModule],
  templateUrl: './producto-list.html',
  styleUrl: './producto-list.css',
})
export class ProductoList implements OnInit {
  productos: Producto[] = [];
  fileBaseUrl = environment.apiUrl;
  placeholderImg = PRODUCTO_PLACEHOLDER;
  onImgError = manejarErrorImagenProducto;

  constructor(
    private productoService: ProductoService,
    private cdr: ChangeDetectorRef,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.productoService.getAll().subscribe({
      next: (data) => {
        this.productos = data;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.notification.error(err?.error?.message ?? 'No se pudieron cargar los productos.');
      },
    });
  }

  eliminar(id: number): void {
    if (!confirm('¿Eliminar este producto?')) return;

    this.productoService.delete(id).subscribe({
      next: () => this.cargarProductos(),
      error: (err) => {
        this.notification.error(err?.error?.message ?? 'No se pudo eliminar el producto.');
      },
    });
  }
}
