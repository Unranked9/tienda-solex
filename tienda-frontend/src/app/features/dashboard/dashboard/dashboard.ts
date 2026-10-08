import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { ProductoService } from '../../../core/services/producto';
import { CategoriaService } from '../../../core/services/categoria';
import { ClienteService } from '../../../core/services/cliente';
import { VentaService } from '../../../core/services/venta';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  totalProductos = 0;
  totalCategorias = 0;
  totalVentas = 0;
  totalClientes = 0;
  cargando = true;
  ultimasVentas: any[] = [];

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private clienteService: ClienteService,
    private ventaService: VentaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    forkJoin({
      productos: this.productoService.getAll(),
      categorias: this.categoriaService.getAll(),
      clientes: this.clienteService.getAll(),
      ventas: this.ventaService.getAll(),
    }).subscribe({
      next: ({ productos, categorias, clientes, ventas }) => {
        this.totalProductos = productos.length;
        this.totalCategorias = categorias.length;
        this.totalClientes = clientes.length;
        this.totalVentas = ventas.length;

        this.ultimasVentas = ventas
          .slice()
          .sort(
            (a, b) =>
              new Date(b.fecha).getTime() -
              new Date(a.fecha).getTime()
          )
          .slice(0, 5);

        this.cargando = false;

        this.cdr.markForCheck();
      },

      error: (err) => {
        console.error('Error al cargar datos del dashboard', err);

        this.cargando = false;

        this.cdr.markForCheck();
      },
    });
  }
}
  