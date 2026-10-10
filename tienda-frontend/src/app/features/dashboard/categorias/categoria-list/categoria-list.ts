import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Categoria } from '../../../../models/categoria.model';
import { CategoriaService } from '../../../../core/services/categoria';
import { NotificationService } from '../../../../core/services/notification';

@Component({
  selector: 'app-categoria-list',
  imports: [RouterLink, CommonModule],
  templateUrl: './categoria-list.html',
  styleUrl: './categoria-list.css',
})
export class CategoriaList implements OnInit {
  categorias: Categoria[] = [];

  constructor(
    private categoriaService: CategoriaService,
    private cdr: ChangeDetectorRef,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.categoriaService.getAll().subscribe({
      next: (data) => {
        this.categorias = data;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.notification.error(err?.error?.message ?? 'No se pudieron cargar las categorías.');
      },
    });
  }

  eliminar(id: number): void {
    if (!confirm('¿Eliminar esta categoría?')) return;

    this.categoriaService.delete(id).subscribe({
      next: () => this.cargar(),
      error: (err) => {
        this.notification.error(err?.error?.message ?? 'No se pudo eliminar la categoría.');
      },
    });
  }
}
