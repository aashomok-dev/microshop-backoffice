// src/admin/admin.routes.ts
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
            }
            // Додаткові модулі: orders, products, roles тощо — їх додаватимемо пізніше
        ]
    }
];
