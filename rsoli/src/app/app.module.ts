import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {AccordionModule} from 'primeng/accordion';     //accordion and accordion tab


import { HeaderComponent } from './componentes/header/header.component';
import { SliderComponent } from './componentes/slider/slider.component';
import { FooterComponent } from './componentes/footer/footer.component';
import { MiniHeaderComponent } from './componentes/mini-header/mini-header.component';

import { MenubarModule } from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import {GalleriaModule} from 'primeng/galleria';

import { HttpClientModule } from '@angular/common/http';
import {ImageModule} from 'primeng/image';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SliderComponent,
    FooterComponent,
    MiniHeaderComponent,
  ],
  imports: [
    BrowserModule,
    AccordionModule,

    BrowserAnimationsModule,
    MenubarModule,
    InputTextModule,
    ButtonModule,
    RippleModule,
    GalleriaModule,
    HttpClientModule,
    ImageModule,
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
