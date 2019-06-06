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
      this.adminaccount = data;
    },(err)=> console.log(err));

    this.signupService.checkbankaccount()
    .subscribe((data)=>{
      this.bankaccount = data;
    },(err)=> console.log(err));
  }
}
