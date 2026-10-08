import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderDashboard } from '../../shared/header-dashboard/header-dashboard';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { Footer } from '../../shared/footer/footer';

@Component({
  selector: 'app-dashboard-layout',
  imports: [RouterOutlet, HeaderDashboard, Sidebar, Footer],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css',
})
export class DashboardLayout {}