import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';

import { HeaderComponent } from './header/header.component';
import { SliderComponent } from './slider/slider.component';
import { FooterComponent } from './footer/footer.component';
import { MiniHeaderComponent } from './mini-header/mini-header.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {AccordionModule} from 'primeng/accordion';     //accordion and accordion tab

import { MenubarModule } from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import {GalleriaModule} from 'primeng/galleria';
import {ImageModule} from 'primeng/image';

@NgModule({
  declarations: [
    HeaderComponent,
    SliderComponent,
    FooterComponent,
    MiniHeaderComponent,
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    AccordionModule,
    BrowserAnimationsModule,
    MenubarModule,
    InputTextModule,
    ButtonModule,
    RippleModule,
    GalleriaModule,
    ImageModule,
  ],
  exports:[HeaderComponent,SliderComponent,FooterComponent,MiniHeaderComponent]
})
export class SharedModule { }
