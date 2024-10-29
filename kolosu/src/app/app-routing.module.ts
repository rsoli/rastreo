import { RouterModule, PreloadAllModules } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { AppLayoutComponent } from "./layout/app.layout.component";

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '', component: AppLayoutComponent,
                children: [
                    // { path: '', loadChildren: () => import('./demo/components/dashboard/dashboard.module').then(m => m.DashboardModule) },
                    { path: '', loadChildren: () => import('./demo/components/public/inicio/inicio.module').then(m => m.InicioModule) },
                    { path: 'uikit', loadChildren: () => import('./demo/components/uikit/uikit.module').then(m => m.UIkitModule) },
                    { path: 'utilities', loadChildren: () => import('./demo/components/utilities/utilities.module').then(m => m.UtilitiesModule) },
                    { path: 'documentation', loadChildren: () => import('./demo/components/documentation/documentation.module').then(m => m.DocumentationModule) },
                    { path: 'blocks', loadChildren: () => import('./demo/components/primeblocks/primeblocks.module').then(m => m.PrimeBlocksModule) },
                    { path: 'pages', loadChildren: () => import('./demo/components/pages/pages.module').then(m => m.PagesModule) },
                    { path: 'public', loadChildren: () => import('./demo/components/public/public.module').then(m => m.PublicModule) },
                    { path: 'rastreo', loadChildren: () => import('./demo/components/rastreo/rastreo.module').then(m => m.RastreoModule) },
                    { path: 'reportes', loadChildren: () => import('./demo/components/reportes/reportes.module').then(m => m.ReportesModule) },
                    { path: 'seguridad', loadChildren: () => import('./demo/components/seguridad/seguridad.module').then(m => m.SeguridadModule) }
                ]
            },
            { path: 'auth', loadChildren: () => import('./demo/components/auth/auth.module').then(m => m.AuthModule) },
            { path: 'landing', loadChildren: () => import('./demo/components/landing/landing.module').then(m => m.LandingModule) },
            { path: 'notfound', component: NotfoundComponent },
            { path: '**', redirectTo: '/notfound' },
        ], { 
            scrollPositionRestoration: 'enabled', 
            anchorScrolling: 'enabled', 
            onSameUrlNavigation: 'ignore',
            preloadingStrategy: PreloadAllModules 
        })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
