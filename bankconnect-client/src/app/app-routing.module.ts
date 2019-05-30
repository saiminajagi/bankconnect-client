import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminaccountsetupComponent } from './adminaccountsetup/adminaccountsetup.component';
import { AdminprofileComponent } from './adminprofile/adminprofile.component';
import { IdbpintegrateComponent } from './idbpintegrate/idbpintegrate.component';
import { GetAdminProfileResolverService } from './adminprofile/get-adminprofile-resolver.service';

const routes: Routes = [
  { path : '' , redirectTo : 'accountsetup', pathMatch: 'full'},
  { path: 'accountsetup', component: AdminaccountsetupComponent},
  { path: 'adminprofile', component: AdminprofileComponent, resolve : { admin_profile : GetAdminProfileResolverService}},
  { path: 'idbpintegrate', component: IdbpintegrateComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
