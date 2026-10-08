import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Categoria } from '../../../../models/categoria.model';
import { CategoriaService } from '../../../../core/services/categoria';

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
    private cdr: ChangeDetectorRef
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
      error: (err) => console.error('Error al cargar categorías', err),
    });
  }

  eliminar(id: number): void {
    if (!confirm('¿Eliminar esta categoría?')) return;

    this.categoriaService.delete(id).subscribe({
      next: () => this.cargar(),
      error: (err) => console.error('Error al eliminar categoría', err),
    });
  }
}
