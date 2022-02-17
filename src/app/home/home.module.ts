import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
