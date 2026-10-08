import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  correo: string = '';
  contrasna: string = '';

  mensajeError = signal<string | null>(null);
  cargando = signal(false);

  private authservice = inject(Auth);
  private router = inject(Router);

  login(): void {
    this.mensajeError.set(null);
    this.cargando.set(true);

    this.authservice.login(this.correo, this.contrasna).subscribe({
      next: () => {
        this.cargando.set(false);
        const rol = this.authservice.getRol();
        if (rol === 'ROLE_ADMIN' || rol === 'ROLE_EMPLEADO') {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        this.cargando.set(false);
        this.mensajeError.set(
          err.status === 401
            ? 'Correo o contraseña incorrectos'
            : 'No se pudo iniciar sesión. Intenta nuevamente.'
        );
      },
    });
  }
}
