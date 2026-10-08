import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth-guard';
import { adminGuard } from './core/guards/admin-guard';
import { clienteGuard } from './core/guards/cliente-guard';

export const routes: Routes = [

    {
    path: '',
    loadComponent: () => import('./layouts/tienda-layout/tienda-layout').then(m => m.TiendaLayout),
    children: [
        { path: '', loadComponent: () => import('./features/tienda/home/home').then(m => m.Home) },
        { path: 'catalogo', loadComponent: () => import('./features/tienda/producto-catalogo/producto-catalogo').then(m => m.ProductoCatalogo) },
        { path: 'producto/:id', loadComponent: () => import('./features/tienda/producto-detalle/producto-detalle').then(m => m.ProductoDetalle) },
        { path: 'carrito', loadComponent: () => import('./features/tienda/carrito/carrito').then(m => m.Carrito) },
        { path: 'mis-compras', canActivate: [clienteGuard], loadComponent: () => import('./features/tienda/mis-compras/mis-compras').then(m => m.MisCompras) },
    ],
},

    {
        path: 'login',
        loadComponent: () => import('./Business/Autenthication/login/login').then(m => m.Login),
    },
    {
        path: 'registro',
        loadComponent: () => import('./Business/Autenthication/registro/registro').then(m => m.Registro),
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./layouts/dashboard-layout/dashboard-layout').then(m => m.DashboardLayout),
        canActivate: [authGuard, adminGuard],
        children: [
            { path: '', redirectTo: 'inicio', pathMatch: 'full' },
            {
                path: 'inicio',
                loadComponent: () => import('./features/dashboard/dashboard/dashboard').then(m => m.Dashboard),
            },
            {
                path: 'productos',
                loadComponent: () => import('./features/dashboard/productos/producto-list/producto-list').then(m => m.ProductoList),
            },
            {
                path: 'productos/nuevo',
                loadComponent: () => import('./features/dashboard/productos/producto-form/producto-form').then(m => m.ProductoForm),
            },
            {
                path: 'productos/editar/:id',
                loadComponent: () => import('./features/dashboard/productos/producto-form/producto-form').then(m => m.ProductoForm),
            },
            {
    path: 'categorias',
    loadComponent: () => import('./features/dashboard/categorias/categoria-list/categoria-list').then(m => m.CategoriaList),
},
{
    path: 'categorias/nuevo',
    loadComponent: () => import('./features/dashboard/categorias/categoria-form/categoria-form').then(m => m.CategoriaForm),
},
{
    path: 'categorias/editar/:id',
    loadComponent: () => import('./features/dashboard/categorias/categoria-form/categoria-form').then(m => m.CategoriaForm),
},
{
    path: 'clientes',
    loadComponent: () => import('./features/dashboard/clientes/cliente-list/cliente-list').then(m => m.ClienteList),
},
{
    path: 'clientes/nuevo',
    loadComponent: () => import('./features/dashboard/clientes/cliente-form/cliente-form').then(m => m.ClienteForm),
},
{
    path: 'clientes/editar/:id',
    loadComponent: () => import('./features/dashboard/clientes/cliente-form/cliente-form').then(m => m.ClienteForm),
},
{
    path: 'ventas',
    loadComponent: () => import('./features/dashboard/ventas/venta-list/venta-list').then(m => m.VentaList),
},
        ],
    },

    { path: '**', redirectTo: '' },

];