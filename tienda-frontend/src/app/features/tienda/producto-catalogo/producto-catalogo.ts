import { Component, OnInit ,ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Producto } from '../../../models/producto.model';
import { Categoria } from '../../../models/categoria.model';
import { ProductoService } from '../../../core/services/producto';
import { CategoriaService } from '../../../core/services/categoria';
import { Carrito } from '../../../core/services/carrito';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-producto-catalogo',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './producto-catalogo.html',
  styleUrl: './producto-catalogo.css',
})
export class ProductoCatalogo implements OnInit {
  productos: Producto[] = [];
  categorias: Categoria[] = [];
  filtroNombre = '';
  categoriaSeleccionada: number | null = null;
  fileBaseUrl = environment.apiUrl;

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private router: Router,
    private route: ActivatedRoute,
    private carrito: Carrito,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.categoriaService.getAll().subscribe({
      next: (data) => (this.categorias = data),
      error: (err) => console.error('Error al cargar categorías', err),
    });

    // Permite llegar aquí desde el Home con /catalogo?categoriaId=X ya filtrado.
    this.route.queryParamMap.subscribe((params) => {
      const categoriaId = params.get('categoriaId');
      this.categoriaSeleccionada = categoriaId ? Number(categoriaId) : null;
      this.cargarProductos();
    });
  }

  cargarProductos(): void {
  this.productoService
    .getAll(this.categoriaSeleccionada ?? undefined)
    .subscribe({
      next: (data) => {
        this.productos = data;
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Error al cargar productos', err),
    });
}


  filtrarPorCategoria(): void {
    this.cargarProductos();
  }

  get productosFiltrados(): Producto[] {
    if (!this.filtroNombre.trim()) return this.productos;
    const texto = this.filtroNombre.toLowerCase();
    return this.productos.filter((p) => p.nombre.toLowerCase().includes(texto));
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
  }
}