import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SmplSelect2Module } from 'smpl-select2';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SmplSelect2Module
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
