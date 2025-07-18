import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { RegisterComponent } from './auth/register/register.component';
import { AuthModule } from './auth/auth.module';

const routes: Routes = [
  {
    path: '',
    component: LandingComponent
  },
  {
    path:'register',
    component: RegisterComponent
  }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes),
    AuthModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
