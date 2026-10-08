import { Injectable, signal, computed } from '@angular/core';
import { ItemCarrito } from '../../models/carrito.model';

const CARRITO_KEY = 'carrito';

@Injectable({ providedIn: 'root' })
export class Carrito {
  private items = signal<ItemCarrito[]>(this.cargarDeStorage());

  readonly itemsCarrito = computed(() => this.items());
  readonly totalItems = computed(() =>
    this.items().reduce((acc, i) => acc + i.cantidad, 0)
  );
  readonly totalPrecio = computed(() =>
    this.items().reduce((acc, i) => acc + i.precio * i.cantidad, 0)
  );

  agregar(item: ItemCarrito): void {
    const actuales = this.items();
    const existente = actuales.find((i) => i.productoId === item.productoId);

    if (existente) {
      const nuevaCantidad = Math.min(
        existente.cantidad + item.cantidad,
        existente.stockDisponible
      );
      this.actualizarCantidad(item.productoId, nuevaCantidad);
    } else {
      this.items.set([...actuales, item]);
      this.guardar();
    }
  }

  actualizarCantidad(productoId: number, cantidad: number): void {
    const actuales = this.items().map((i) =>
      i.productoId === productoId
        ? { ...i, cantidad: Math.max(1, Math.min(cantidad, i.stockDisponible)) }
        : i
    );
    this.items.set(actuales);
    this.guardar();
  }

  eliminar(productoId: number): void {
    this.items.set(this.items().filter((i) => i.productoId !== productoId));
    this.guardar();
  }

  vaciar(): void {
    this.items.set([]);
    this.guardar();
  }

  private guardar(): void {
    localStorage.setItem(CARRITO_KEY, JSON.stringify(this.items()));
  }

  private cargarDeStorage(): ItemCarrito[] {
    const data = localStorage.getItem(CARRITO_KEY);
    return data ? JSON.parse(data) : [];
  }
}