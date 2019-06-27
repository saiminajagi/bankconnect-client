import { Component, OnInit, NgZone } from '@angular/core';
import { SignupServiceService } from '../services/signup-service.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  login: Number = 0;
  username: string = '';
  profileLink: string = "/profile";
  bank: string = '';
  appTitle = 'IBM BankConnect';
  public profileRoute: string;

  constructor(private signservice: SignupServiceService, private router: Router, public location: Location, private zone: NgZone) { }

  ngOnInit() {
    this.signservice.checkLogin()
      .subscribe((data) => {
        console.log(data);
        if (data === 0) {
          this.login = data;
        } else {
        this.username = data;
        this.login = 1;
        this.signservice.getUserType()
          .subscribe((data) => {
            console.log('came to check the profile type: ' + data);
            if (data === 'admin') {
              this.profileRoute = 'profile';
            } else if (data === 'fintech') {
              this.profileRoute = 'adminprofile';
            } else if (data === 'bank') {
              this.profileRoute = 'adminprofile';
            } else {
              this.profileRoute = 'login';
            }
          }, (err) => console.log(err));
        }
      }, (err) => console.log(err));
  }

  onLogOut() {
    console.log('logout reached');
    this.signservice.logout()
      .subscribe((data) => {
        this.login = 0;
        window.location.href = 'http://ibm.bankconnect:5000/login';
      }, (err) => console.log(err));
  }
}
