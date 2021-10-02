import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
 const routes: Routes = [
   {
     path: '',
     loadChildren: () => import('./paginas/menu/menu.module').then(m => m.MenuModule)
   },
   {
     path: '',
     redirectTo: 'slider',
     pathMatch: 'full'
   }
 ];


@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
