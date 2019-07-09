import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SignupServiceService } from '../services/signup-service.service';

@Component({
  selector: 'app-apilist',
  templateUrl: './apilist.component.html',
  styleUrls: ['./apilist.component.scss']
})
export class ApilistComponent implements OnInit {

  bank: String;
  public subscribedStatus = false;    // flag for subscription status msg
  subscribedStatusmsg: any;
  fintech: Number;
  Apilist: Array<String> = [];

  //partner details
  email: String;
  org: String;
  active: Boolean;

  constructor(private router: Router, private route: ActivatedRoute, private signservice: SignupServiceService) {
    this.route.params.subscribe(params => {
      console.log("bank name is: " + params['bankname']);
      var myObj = {
        bank: params['bankname']
      }

      this.bank = params['bankname'];

      this.signservice.getApis(myObj)
        .subscribe((data) => {
          console.log("data is: " + data);
          this.Apilist = data;
        }, (err) => console.log(err));

      this.signservice.getUserType()
        .subscribe((data) => {
          console.log(data);
          if (data == "fintech"){
            this.fintech = 1;
          } else {
            this.fintech = 0;}
        }, (err) => console.log(err));

    });
  }

  ngOnInit() {
    this.signservice.getPartnerDetails()
    .subscribe((data)=>{
      console.log(data);
      this.org = data.org;
      this.email = data.email;
      this.active = data.active;
    },(err)=>console.log(err));
  }

  setApi(apiname) {
    this.router.navigateByUrl(`/overview/${apiname}`);
  }

  subscribe(i, apiname) {

    (document.querySelectorAll('.Subscribe')[i] as HTMLElement).setAttribute('disabled', '');

    var myObj = {
      api: apiname,
      bank: this.bank
    }

    // should he request for the approval?
    this.signservice.subscribeApi(myObj)
      .subscribe((data) => {
        console.log(data);
        this.subscribedStatusmsg = data;
        this.subscribedStatus = true;
        setTimeout(function() {
          this.subscribedStatus = false;
        }.bind(this), 3000);
      }, (err) => console.log(err));

    var myObj2 = {
      api: apiname,
      bank: this.bank,
      email: this.email
    }

    // send this to business manager as well
    this.signservice.addSubscribeApi(myObj2)
      .subscribe((data) => {
        console.log(data);
      }, (err) => console.log(err))

  }
}
