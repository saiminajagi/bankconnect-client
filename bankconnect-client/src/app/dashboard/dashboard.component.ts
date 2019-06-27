import { Component, OnInit } from '@angular/core';
import { SignupServiceService } from '../services/signup-service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public admin = false;
  public bank =  false;
  public fintech = false;

  constructor(private signupService: SignupServiceService) { }

  ngOnInit() {

    this.signupService.checkuserfordashboard()
    .subscribe((data)=>{
      if (data === 'admin') {
        this.admin = true;
      } else if (data === 'fintech') {
        this.fintech = true;
      } else if (data === 'bank') {
        this.bank = true;
      } else { console.log('dashboard user not found'); }
    },(err)=> console.log(err));
  }
}
