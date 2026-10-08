import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriaService } from '../../../../core/services/categoria';

@Component({
  selector: 'app-categoria-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './categoria-form.html',
  styleUrl: './categoria-form.css',
})
export class CategoriaForm implements OnInit {
  form: FormGroup;
  editandoId?: number;
  guardando = false;

  constructor(
    private fb: FormBuilder,
    private categoriaService: CategoriaService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(120)]],
      descripcion: ['', Validators.maxLength(255)],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.editandoId = Number(id);

      this.categoriaService.getById(this.editandoId).subscribe({
        next: (c) => {
          this.form.patchValue(c);
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Error al cargar categoría', err);
        },
      });
    }
  }

  guardar(): void {
    if (this.form.invalid) return;

    this.guardando = true;
    this.cdr.markForCheck();

    const accion = this.editandoId
      ? this.categoriaService.update(this.editandoId, this.form.value)
      : this.categoriaService.create(this.form.value);

    accion.subscribe({
      next: () => {
        this.router.navigate(['/dashboard/categorias']);
      },
      error: (err) => {
        console.error('Error al guardar categoría', err);
        this.guardando = false;
        this.cdr.markForCheck();
      },
    });
  }
}
