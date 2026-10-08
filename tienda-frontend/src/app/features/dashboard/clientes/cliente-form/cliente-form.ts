import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteService } from '../../../../core/services/cliente';

@Component({
  selector: 'app-cliente-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cliente-form.html',
  styleUrl: './cliente-form.css',
})
export class ClienteForm implements OnInit {
  form: FormGroup;
  editandoId?: number;
  guardando = false;

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      nombreCompleto: ['', [Validators.required, Validators.maxLength(120)]],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.maxLength(20)],
      direccion: ['', Validators.maxLength(255)],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.editandoId = Number(id);

      this.clienteService.getById(this.editandoId).subscribe({
        next: (c) => {
          this.form.patchValue(c);
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Error al cargar cliente', err);
        },
      });
    }
  }

  guardar(): void {
    if (this.form.invalid) return;

    this.guardando = true;
    this.cdr.markForCheck();

    const accion = this.editandoId
      ? this.clienteService.update(this.editandoId, this.form.value)
      : this.clienteService.create(this.form.value);

    accion.subscribe({
      next: () => {
        this.router.navigate(['/dashboard/clientes']);
      },
      error: (err) => {
        console.error('Error al guardar cliente', err);
        this.guardando = false;
        this.cdr.markForCheck();
      },
    });
  }
}
