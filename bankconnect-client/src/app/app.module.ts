import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material';
import { AdminaccountsetupComponent } from './adminaccountsetup/adminaccountsetup.component';
import { AdminprofileComponent } from './adminprofile/adminprofile.component';
import { IdbpintegrateComponent } from './idbpintegrate/idbpintegrate.component';
import { NavComponent } from './nav/nav.component';

@NgModule({
  declarations: [
    AppComponent,
    AdminaccountsetupComponent,
    AdminprofileComponent,
    IdbpintegrateComponent,
    NavComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
