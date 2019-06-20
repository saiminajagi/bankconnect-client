import { Component, OnInit } from '@angular/core';
import { SignupServiceService } from '../services/signup-service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  adminaccount = 0;
  bankaccount = 0;

  constructor(private signupService: SignupServiceService) { }

  ngOnInit() {

    this.signupService.checkadminaccount()
    .subscribe((data)=>{
      console.log(data+"at dasborad")
      this.adminaccount = data;
    },(err)=> console.log(err));

    this.signupService.checkbankaccount()
    .subscribe((data)=>{
      console.log(data+"at bankaccount")
      this.bankaccount = data;
    },(err)=> console.log(err));
  }
}
