import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SignupServiceService } from './services/signup-service.service';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule} from '@angular/common/http';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material';
import { AdminaccountsetupComponent } from './adminaccountsetup/adminaccountsetup.component';
import { AdminprofileComponent } from './adminprofile/adminprofile.component';
import { IdbpintegrateComponent } from './idbpintegrate/idbpintegrate.component';
import { NavComponent } from './nav/nav.component';
import { GetAdminProfileResolverService } from './adminprofile/get-adminprofile-resolver.service';


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
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [SignupServiceService, GetAdminProfileResolverService],
  bootstrap: [AppComponent]
})
export class AppModule { }
