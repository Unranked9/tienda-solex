import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Cliente } from '../../../../models/cliente.model';
import { ClienteService } from '../../../../core/services/cliente';

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
    private cdr: ChangeDetectorRef
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
      error: (err) => console.error('Error al cargar clientes', err),
    });
  }

  eliminar(id: number): void {
    if (!confirm('¿Eliminar este cliente?')) return;

    this.clienteService.delete(id).subscribe({
      next: () => this.cargar(),
      error: (err) => console.error('Error al eliminar cliente', err),
    });
  }
}
