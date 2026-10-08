import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductoService } from '../../../../core/services/producto';
import { CategoriaService } from '../../../../core/services/categoria';
import { Categoria } from '../../../../models/categoria.model';
import { NotificationService } from '../../../../core/services/notification';

// Debe coincidir con TIPOS_PERMITIDOS de FileStorageServiceImpl (backend).
const TIPOS_IMAGEN_PERMITIDOS = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const TAMANO_MAXIMO_BYTES = 5 * 1024 * 1024; // 5MB, igual que spring.servlet.multipart.max-file-size

@Component({
  selector: 'app-producto-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './producto-form.html',
  styleUrl: './producto-form.css',
})
export class ProductoForm implements OnInit {
  form: FormGroup;
  imagenSeleccionada?: File;
  imagenPreviewUrl: string | null = null;
  imagenExistenteUrl: string | null = null;
  editandoId?: number;
  guardando = false;
  categorias: Categoria[] = [];

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private notification: NotificationService
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(120)]],
      descripcion: ['', Validators.maxLength(500)],
      precio: [0, [Validators.required, Validators.min(0.01)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      categoriaId: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.categoriaService.getAll().subscribe({
      next: (data) => {
        this.categorias = data;
        this.cdr.markForCheck();
      },
      error: () => {
        this.notification.error('No se pudieron cargar las categorías.');
      },
    });

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.editandoId = Number(id);

      this.productoService.getById(this.editandoId).subscribe({
        next: (p) => {
          this.form.patchValue(p);
          this.imagenExistenteUrl = p.imagenUrl ?? null;
          this.cdr.markForCheck();
        },
        error: () => {
          this.notification.error('No se pudo cargar el producto solicitado.');
          this.router.navigate(['/dashboard/productos']);
        },
      });
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const archivo = input.files?.[0];

    if (!archivo) {
      return;
    }

    if (!TIPOS_IMAGEN_PERMITIDOS.includes(archivo.type)) {
      this.notification.error(
        'El formato de imagen no es válido. Solo se permiten archivos JPG, PNG o WEBP. Por favor, inserta otra imagen.'
      );
      input.value = '';
      return;
    }

    if (archivo.size > TAMANO_MAXIMO_BYTES) {
      this.notification.error('La imagen supera el tamaño máximo permitido (5MB). Elige otra imagen.');
      input.value = '';
      return;
    }

    this.imagenSeleccionada = archivo;

    // Vista previa inmediata antes de subir nada al servidor.
    const lector = new FileReader();
    lector.onload = () => {
      this.imagenPreviewUrl = lector.result as string;
      this.cdr.markForCheck();
    };
    lector.readAsDataURL(archivo);
  }

  quitarImagenSeleccionada(): void {
    this.imagenSeleccionada = undefined;
    this.imagenPreviewUrl = null;
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notification.warning('Revisa los campos marcados antes de guardar.');
      return;
    }

    this.guardando = true;
    this.cdr.markForCheck();

    const accion = this.editandoId
      ? this.productoService.update(this.editandoId, this.form.value)
      : this.productoService.create(this.form.value);

    accion.subscribe({
      next: (producto) => {
        if (this.imagenSeleccionada) {
          this.productoService
            .actualizarImagen(producto.id, this.imagenSeleccionada)
            .subscribe({
              next: () => this.finalizar('Producto guardado correctamente.'),
              error: (err) => {
                const mensaje =
                  err?.error?.message ??
                  'El producto se guardó, pero la imagen no pudo subirse. Puedes editarlo para intentarlo de nuevo.';
                this.notification.warning(mensaje);
                this.finalizar();
              },
            });
        } else {
          this.finalizar('Producto guardado correctamente.');
        }
      },
      error: (err) => {
        const mensaje = err?.error?.message ?? 'Ocurrió un error al guardar el producto.';
        this.notification.error(mensaje);
        this.guardando = false;
        this.cdr.markForCheck();
      },
    });
  }

  private finalizar(mensajeExito?: string): void {
    this.guardando = false;
    this.cdr.markForCheck();
    if (mensajeExito) {
      this.notification.success(mensajeExito);
    }
    this.router.navigate(['/dashboard/productos']);
  }
}
