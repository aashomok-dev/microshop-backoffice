import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const ADMIN_ROUTES: Routes = [
    {
        path: '',
        component: LayoutComponent, // Фрейм адмін-панелі
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
            {
                path: 'dashboard',
                component: DashboardComponent
            },
            {
                path: 'users',
                loadChildren: () => import('./users/users.routes').then(m => m.USERS_ROUTES)
            },
            {
                path: 'products',
                loadChildren: () => import('./products/products.routes').then(m => m.PRODUCTS_ROUTES)
            },
            {
                path: 'categories',
                loadChildren: () => import('./categories/categories.routes').then(m => m.CATEGORIES_ROUTES)
            }
        ]
    }
];
