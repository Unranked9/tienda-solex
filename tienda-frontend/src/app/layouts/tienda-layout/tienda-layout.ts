import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderTienda } from '../../shared/header-tienda/header-tienda';
import { Footer } from '../../shared/footer/footer';

@Component({
  selector: 'app-tienda-layout',
  imports: [RouterOutlet, HeaderTienda, Footer],
  templateUrl: './tienda-layout.html',
  styleUrl: './tienda-layout.css',
})
export class TiendaLayout {}