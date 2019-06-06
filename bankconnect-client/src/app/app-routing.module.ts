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

const routes: Routes = [
  { path : '' , redirectTo : 'home', pathMatch: 'full'},
  { path: 'home', component: HomeComponent },
  { path: 'accountsetup', component: AdminaccountsetupComponent},
  { path: 'adminprofile', component: AdminprofileComponent, resolve : { admin_profile : GetAdminProfileResolverService}},
  { path: 'idbpintegrate', component: IdbpintegrateComponent},
  { path: 'support', component: SupportComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'createbankaccount', component: CreatebankaccountComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
