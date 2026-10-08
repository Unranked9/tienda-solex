import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../../core/services/auth';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {

  nombreCompleto: string = '';
  correo: string = '';
  contrasena: string = '';

  mensajeError = signal<string | null>(null);
  cargando = signal(false);

  private authservice = inject(Auth);
  private router = inject(Router);

  registrar(): void {
    this.mensajeError.set(null);
    this.cargando.set(true);

    this.authservice.registrar(this.nombreCompleto, this.correo, this.contrasena).subscribe({
      next: () => {
        this.cargando.set(false);
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.cargando.set(false);
        this.mensajeError.set(
          error.status === 409
            ? 'Ya existe una cuenta registrada con ese correo'
            : 'No se pudo completar el registro. Verifica tus datos.'
        );
      },
    });
  }
}
