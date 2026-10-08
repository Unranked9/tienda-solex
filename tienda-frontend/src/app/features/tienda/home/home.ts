import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Producto } from '../../../models/producto.model';
import { Categoria } from '../../../models/categoria.model';
import { ProductoService } from '../../../core/services/producto';
import { CategoriaService } from '../../../core/services/categoria';
import { Carrito } from '../../../core/services/carrito';
import { NotificationService } from '../../../core/services/notification';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  productosDestacados: Producto[] = [];
  categorias: Categoria[] = [];
  cargandoProductos = true;
  fileBaseUrl = environment.apiUrl;

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private router: Router,
    private carrito: Carrito,
    private notification: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.categoriaService.getAll().subscribe({
      next: (data) => {
        this.categorias = data.slice(0, 6);
        this.cdr.markForCheck();
      },
      error: () => console.error('No se pudieron cargar las categorías destacadas'),
    });

    this.productoService.getAll().subscribe({
      next: (data) => {
        this.productosDestacados = data.slice(0, 8);
        this.cargandoProductos = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.cargandoProductos = false;
        this.cdr.markForCheck();
      },
    });
  }

  irACatalogo(categoriaId?: number): void {
    if (categoriaId != null) {
      this.router.navigate(['/catalogo'], { queryParams: { categoriaId } });
    } else {
      this.router.navigate(['/catalogo']);
    }
  }

  agregarAlCarrito(producto: Producto, event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    this.carrito.agregar({
      productoId: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: 1,
      imagenUrl: producto.imagenUrl,
      stockDisponible: producto.stock,
    });

    this.notification.success(`"${producto.nombre}" se agregó al carrito.`);
  }

  // Genera un degradado consistente por categoría (mismo id -> mismo color)
  // para las tarjetas de "Categorías destacadas", sin depender de imágenes.
  colorCategoria(id: number): string {
    const paleta = [
      'linear-gradient(135deg, #1e1e2d, #3a3a52)',
      'linear-gradient(135deg, #4a3418, #d4af37)',
      'linear-gradient(135deg, #14141a, #4a4a55)',
      'linear-gradient(135deg, #2e2e3d, #6b6b85)',
      'linear-gradient(135deg, #3a2a10, #b8902e)',
      'linear-gradient(135deg, #1a1a24, #52526b)',
    ];
    return paleta[id % paleta.length];
  }
}
