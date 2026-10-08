import { Component, inject } from '@angular/core';
import { NotificationService } from '../../core/services/notification';

@Component({
  selector: 'app-toast',
  imports: [],
  templateUrl: './toast.html',
  styleUrl: './toast.css',
})
export class ToastComponent {
  readonly notification = inject(NotificationService);

  cerrar(id: number): void {
    this.notification.cerrar(id);
  }

  icono(type: string): string {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '!';
      default:
        return 'i';
    }
  }
}
