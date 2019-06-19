import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminaccountsetupComponent } from './adminaccountsetup/adminaccountsetup.component';
import { AdminprofileComponent } from './adminprofile/adminprofile.component';
import { IdbpintegrateComponent } from './idbpintegrate/idbpintegrate.component';
import { GetAdminProfileResolverService } from './adminprofile/get-adminprofile-resolver.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CreatebankaccountComponent } from './createbankaccount/createbankaccount.component';
import { SupportComponent } from './support/support.component';
import { HomeComponent } from './home/home.component';
import { BanklistComponent } from './banklist/banklist.component';
import { OverviewComponent } from './overview/overview.component';
import { ApilistComponent } from './apilist/apilist.component';
import { ProfileComponent } from './profile/profile.component';
import { GetUserProfileResolverService } from './profile/profile-resolver.service';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { RefreshComponent } from './refresh/refresh.component';


const routes: Routes = [
  { path : '' , redirectTo : 'home', pathMatch: 'full'},
  { path: 'home', component: HomeComponent },
  { path: 'accountsetup', component: AdminaccountsetupComponent},
  { path: 'adminprofile', component: AdminprofileComponent, resolve : { admin_profile : GetAdminProfileResolverService}},
  { path: 'idbpintegrate', component: IdbpintegrateComponent},
  { path: 'support', component: SupportComponent },
  { path: 'refresh', component: RefreshComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'createbankaccount', component: CreatebankaccountComponent},
  { path: 'banklist', component: BanklistComponent},
  { path: 'overview/:apiname', component: OverviewComponent},
  { path: 'apilist/:bankname', component: ApilistComponent},
  { path: 'profile', component: ProfileComponent, resolve:{userprofile: GetUserProfileResolverService}},
  { path: 'login', component: LoginComponent},
  { path: 'signup', component:SignupComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
