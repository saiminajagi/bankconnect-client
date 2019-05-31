import { Component, OnInit } from '@angular/core';
import { SignupServiceService } from '../services/signup-service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  bank_connected = 0;
  integrated = 0;

  constructor(private signupService: SignupServiceService) { }

  ngOnInit() {
    this.signupService.checkBankConnect()
    .subscribe((data)=>{
      this.bank_connected = data;
    },(err)=> console.log(err));

    this.signupService.checkintegrated()
    .subscribe((data)=>{
      this.integrated = data;
    },(err)=> console.log(err));
  }

}