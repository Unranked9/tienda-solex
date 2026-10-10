import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Cliente } from '../../../../models/cliente.model';
import { ClienteService } from '../../../../core/services/cliente';
import { NotificationService } from '../../../../core/services/notification';

@Component({
  selector: 'app-cliente-list',
  imports: [RouterLink, CommonModule],
  templateUrl: './cliente-list.html',
  styleUrl: './cliente-list.css',
})
export class ClienteList implements OnInit {
  clientes: Cliente[] = [];

  constructor(
    private clienteService: ClienteService,
    private cdr: ChangeDetectorRef,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.clienteService.getAll().subscribe({
      next: (data) => {
        this.clientes = data;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.notification.error(err?.error?.message ?? 'No se pudieron cargar los clientes.');
      },
    });
  }

  eliminar(id: number): void {
    if (!confirm('¿Eliminar este cliente?')) return;

    this.clienteService.delete(id).subscribe({
      next: () => this.cargar(),
      error: (err) => {
        this.notification.error(err?.error?.message ?? 'No se pudo eliminar el cliente.');
      },
    });
  }
}
