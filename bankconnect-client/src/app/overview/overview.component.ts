import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SignupServiceService } from '../services/signup-service.service';


@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  apiname: string;
  name = 'default';
  desc = 'default';
  key_features = [];
  use_cases = [];
  apiDetails: any;
  testAPIres: any;
  active: Boolean;
  revoked: Boolean;

  public onPressTestAPIbutton = false;

  constructor(private router: Router, private route: ActivatedRoute, private signservice: SignupServiceService) {

    this.route.params.subscribe(params => {
      console.log('Api name is: ' + params['apiname']);
      var myObj = {
        api: params['apiname']
      }

      this.signservice.getApiDetails(myObj)
        .subscribe((data) => {
          console.log('data is: ' + data);
          this.apiDetails = data;
          this.name = data.name;
          this.desc = data.desc;
          this.key_features = data.key_features;
          this.use_cases = data.use_cases;

        }, (err) => console.log(err));
    })
  }

  ngOnInit() {
  }

  apiTestResponse() {
    this.signservice.getSecurityToken()
      .subscribe((data) => {
        var token = data[0].token;
        var active = data[0].active;


        if(active){
          this.signservice.getDummyResponse(token)
          .subscribe((data) => {
            console.log(data);
            this.testAPIres = data;
            this.onPressTestAPIbutton = true;
            this.active = true;
            this.revoked = false;
          });
        }else{
          var errObj = {
            httpCode: 401,
            httpMessage:"Unauthorized",
            messageInformation: "token has been revoked. API access denied"
          }
          this.testAPIres = errObj;
          this.onPressTestAPIbutton = true;
          this.active = true;
          this.revoked = false;
        }
        
      });

  }

}
