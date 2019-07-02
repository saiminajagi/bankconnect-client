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
import { DashboardComponent } from './dashboard/dashboard.component';
import { CreatebankaccountComponent } from './createbankaccount/createbankaccount.component';
import { SupportComponent } from './support/support.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { BanklistComponent } from './banklist/banklist.component';
import { SignupComponent } from './signup/signup.component';
import { OverviewComponent } from './overview/overview.component';
import { ApilistComponent } from './apilist/apilist.component';
import { ProfileComponent } from './profile/profile.component';
import { GetUserProfileResolverService } from './profile/profile-resolver.service';
import { RefreshComponent } from './refresh/refresh.component';
import { FinprofileComponent } from './finprofile/finprofile.component';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { AnalyticsComponent } from './analytics/analytics.component';
import { TransactionResolverService } from './analytics/analytics-resolver.service';

@NgModule({
  declarations: [
    AppComponent,
    AdminaccountsetupComponent,
    AdminprofileComponent,
    IdbpintegrateComponent,
    NavComponent,
    DashboardComponent,
    CreatebankaccountComponent,
    SupportComponent,
    HomeComponent,
    LoginComponent,
    BanklistComponent,
    SignupComponent,
    OverviewComponent,
    ApilistComponent,
    ProfileComponent,
    RefreshComponent,
    FinprofileComponent,
    AnalyticsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule
  ],
  providers: [SignupServiceService, GetAdminProfileResolverService, GetUserProfileResolverService, TransactionResolverService],
  bootstrap: [AppComponent]
})
export class AppModule { }
