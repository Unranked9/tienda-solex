import { Component, inject } from '@angular/core';
import { Auth } from '../../core/services/auth';
import { DashboardUiService } from '../../core/services/dashboard-ui';

@Component({
  selector: 'app-header-dashboard',
  imports: [],
  templateUrl: './header-dashboard.html',
  styleUrl: './header-dashboard.css',
})
export class HeaderDashboard {
  private authService = inject(Auth);
  readonly dashboardUi = inject(DashboardUiService);

  logout(): void {
    // Antes borraba la clave 'token', pero el Auth service guarda el
    // token bajo la clave 'authtoken', asi que el logout nunca cerraba
    // sesion realmente. Se usa el mismo Auth.logout() que ya limpia
    // el token, el carrito y redirige a /login.
    this.authService.logout();
  }
}
