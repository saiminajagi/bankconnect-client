import { Component, OnInit } from '@angular/core';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { SignupServiceService} from '../services/signup-service.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-adminprofile',
  templateUrl: './adminprofile.component.html',
  styleUrls: ['./adminprofile.component.scss']
})

export class AdminprofileComponent implements OnInit {

  signupForm: FormGroup;
  public fintech = false;
  show_admin_profile:any;
  ApiSubscriptionDetails = [];
  show_security_token: any;

  constructor(private signservice: SignupServiceService, private route: ActivatedRoute) {
    this.show_admin_profile = this.route.snapshot.data['admin_profile'];

    console.log('fintech profile received' + this.show_admin_profile);

    if(this.show_admin_profile.usertype === 'fintech') {
      this.fintech = true;
    } else { this.fintech = false; }
  }

  ngOnInit() {
    this.signservice.getsubscribedApis()
    .subscribe((data)=>{
      console.log(data);
      for(var i=0;i<data.length;++i){
        this.ApiSubscriptionDetails.push(data[i]);
      }
    },(err)=>console.log(err));

    this.signservice.getSecurityToken()
      .subscribe((data) => {
        console.log(data);
        this.show_security_token = data;
      }, (err) => console.log(err));
  }

}
