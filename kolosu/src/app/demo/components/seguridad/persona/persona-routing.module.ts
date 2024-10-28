import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonaComponent } from '../persona/persona.component';
import { AuthGuard } from 'src/app/demo/guard/auth.guard';

const routes: Routes = [];

@NgModule({  
  imports: [RouterModule.forChild([
    { path: '', component: PersonaComponent,canActivate: [AuthGuard] }
    
  ])],
  exports: [RouterModule]
})
export class PersonaRoutingModule { }
