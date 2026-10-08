import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ProductoService } from '../../../core/services/producto';
import { CategoriaService } from '../../../core/services/categoria';
import { ClienteService } from '../../../core/services/cliente';
import { VentaService } from '../../../core/services/venta';
import { Producto } from '../../../models/producto.model';
import { MetodoPago, Venta } from '../../../models/venta.model';

const METODOS_PAGO: MetodoPago[] = ['YAPE', 'PLIN', 'TARJETA', 'EFECTIVO', 'TRANSFERENCIA'];
const STOCK_BAJO_LIMITE = 5;

interface BarraMetodoPago {
  metodo: MetodoPago;
  monto: number;
  porcentaje: number;
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  cargando = true;
  ultimasVentas: Venta[] = [];

  ingresosTotales = 0;
  ticketPromedio = 0;
  ventasMesActual = 0;
  productosStockBajo: Producto[] = [];

  ventasPorMetodoPago: BarraMetodoPago[] = [];

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
      next: ({ productos, ventas }) => {
        const ventasPagadas = ventas.filter((v) => v.estado === 'PAGADA');

        this.ingresosTotales = ventasPagadas.reduce((acc, v) => acc + v.total, 0);
        this.ticketPromedio = ventasPagadas.length
          ? this.ingresosTotales / ventasPagadas.length
          : 0;

        const ahora = new Date();
        this.ventasMesActual = ventas.filter((v) => {
          const fecha = new Date(v.fecha);
          return (
            fecha.getMonth() === ahora.getMonth() &&
            fecha.getFullYear() === ahora.getFullYear()
          );
        }).length;

        this.productosStockBajo = productos
          .filter((p) => p.activo && p.stock <= STOCK_BAJO_LIMITE)
          .sort((a, b) => a.stock - b.stock);

        this.ventasPorMetodoPago = this.calcularVentasPorMetodoPago(ventasPagadas);

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

  private calcularVentasPorMetodoPago(ventasPagadas: Venta[]): BarraMetodoPago[] {
    const montos = METODOS_PAGO.map((metodo) => ({
      metodo,
      monto: ventasPagadas
        .filter((v) => v.metodoPago === metodo)
        .reduce((acc, v) => acc + v.total, 0),
    }));

    const montoMaximo = Math.max(...montos.map((m) => m.monto), 0);

    return montos.map(({ metodo, monto }) => ({
      metodo,
      monto,
      porcentaje: montoMaximo > 0 ? (monto / montoMaximo) * 100 : 0,
    }));
  }
}
