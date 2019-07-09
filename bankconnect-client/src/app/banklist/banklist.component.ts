import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SignupServiceService } from '../services/signup-service.service';

@Component({
  selector: 'app-banklist',
  templateUrl: './banklist.component.html',
  styleUrls: ['./banklist.component.scss']
})
export class BanklistComponent implements OnInit {
  confirmed: Number = 1;
  banklist: Array<String> = [];
  active: Boolean;
  email: String;
  org: String;
  public onboardclick = false;
  public onboardStatusmsg: any;

  constructor(private router: Router, private route: ActivatedRoute, private signservice: SignupServiceService) {
    this.signservice.getConfirmation()
      .subscribe((data) => {
        console.log(data);
        this.confirmed = data;
      }, (err) => console.log(err));
  }

  ngOnInit() {
    this.signservice.getBanks()
      .subscribe((data) => {
        console.log("data is: " + JSON.stringify(data));
        this.banklist = data;
      }, (err) => console.log(err));

    this.signservice.getPartnerDetails()
      .subscribe((data) => {
        console.log(data);
        this.org = data.org;
        this.email = data.email;
        this.active = data.active;
      }, (err) => console.log(err));

  }

  setBank(bankname) {
    this.router.navigateByUrl(`/apilist/${bankname}`);
  }

  onboard(i, bankname, element, text) {
    console.log("onboarding to :" + bankname);

    var myObj = {
      org: this.org,
      email: this.email,
    }

    this.onboardclick = true;
    setTimeout(function() {
      this.onboardclick = false;
    }.bind(this), 3000);

    this.signservice.sendReq(myObj)
      .subscribe((data) => {
        console.log(data);
        // to disable the onboard button and show approval pending text
        this.onboardStatusmsg = data;
        element.textContent = data;
        element.disabled = true;
      }, (err) => console.log(err));


  }

}
