import { Component, OnInit ,ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Producto } from '../../../models/producto.model';
import { ProductoService } from '../../../core/services/producto';
import { Carrito } from '../../../core/services/carrito';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-producto-detalle',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './producto-detalle.html',
  styleUrl: './producto-detalle.css',
})
export class ProductoDetalle implements OnInit {
  producto?: Producto;
  cantidad = 1;
  fileBaseUrl = environment.apiUrl;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productoService: ProductoService,
    private carrito: Carrito,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      this.cargarProducto(id);
    });
    this.cdr.markForCheck();
  }

  private cargarProducto(id: number): void {
    this.productoService.getById(id).subscribe({
      next: (data) => {
        this.producto = data;
        this.cantidad = 1; // resetea la cantidad al cambiar de producto
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Error al cargar producto', err),
    });
  }

  agregarAlCarrito(): void {
    if (!this.producto) return;
    this.carrito.agregar({
      productoId: this.producto.id,
      nombre: this.producto.nombre,
      precio: this.producto.precio,
      cantidad: this.cantidad,
      imagenUrl: this.producto.imagenUrl,
      stockDisponible: this.producto.stock,
    });
    this.router.navigate(['/carrito']);
  }
}