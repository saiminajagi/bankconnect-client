import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { SignupServiceService} from '../services/signup-service.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  roleForm: FormGroup;
  passForm : FormGroup;
  rulesForm: FormGroup;

  title = "PROFILE";
  profile=0;pass=0;pending=1;

  profileClass = {
    "buttons" : true,
    "options" : false
  };

  pendingClass = {
    "buttons" : true,
    "options" : true
  };

  passClass = {
    "buttons" : true,
    "options" : false
  };

  partnerClass = {
    "buttons" : true,
    "options" : false
  };

  show_user_profile: any ;
  requests: any;
  partners: any;
  public submitted = false;

  constructor(private signservice: SignupServiceService, private route: ActivatedRoute, private formBuilder: FormBuilder,
    private router: Router, public location: Location, private zone : NgZone) {
      this.show_user_profile = this.route.snapshot.data['userprofile'];
      console.log(this.show_user_profile);

      this.signservice.getUserType()
    .subscribe((data)=>{
      console.log("came to check the profile type: "+ data);
      if(data == "admin")
        this.router.navigateByUrl('/profile');
      else if(data == "fintech"){
        this.zone.run(() => this.router.navigateByUrl('/finprofile'));
        console.log("navigation did not work");
      }
      else if(data == "bank")
        this.router.navigateByUrl('/bankprofile');
      else
        this.router.navigateByUrl('/login');
    },(err)=>console.log(err));
    }

  ngOnInit() {
    this.passForm = this.formBuilder.group({
      old : ['',[Validators.required,Validators]],
      new : ['',[Validators.required,Validators]],
      renew : ['',[Validators.required,Validators]]
    });

    this.signservice.getRequests()
    .subscribe((data)=>{
      console.log(data);
      this.requests = data;
    },(err)=>console.log(err));

  }

  onPassSubmit(){
    var myObj = {
      old : this.passForm.controls.role.value,
      new : this.passForm.controls.userType.value,
      renew : this.passForm.controls.email.value
    }
    console.log("role details: "+myObj);
    this.signservice.sendPassDetails()
    .subscribe((data)=>{
      console.log(data + "from sendRoleDetails");
    },(err)=> console.log(err));
  }

  show_profile(){
    this.profileClass = {
      "buttons" : true,
      "options" : true
    };

    this.passClass = {
      "buttons" : true,
      "options" :false
    };

    this.pendingClass = {
      "buttons" : true,
      "options" :false
    };

    this.partnerClass = {
      "buttons" : true,
      "options" : false
    };


    this.title = "PROFILE";
    //show this and hide other divisions
    (document.querySelector('.profile') as HTMLElement).style.display = 'block';
    (document.querySelector('.changepass') as HTMLElement).style.display = 'none';
    (document.querySelector('.pendingreq') as HTMLElement).style.display = 'none';
    (document.querySelector('.partner') as HTMLElement).style.display = 'none';
  }

  show_pass(){
    this.profileClass = {
      "buttons" : true,
      "options" : false
    };

    this.passClass = {
      "buttons" : true,
      "options" :true
    };

    this.pendingClass = {
      "buttons" : true,
      "options" :false
    };

    this.partnerClass = {
      "buttons" : true,
      "options" : false
    };


    this.title = "CHANGE PASSWORD";
    //show this and hide other divisions
    (document.querySelector('.profile') as HTMLElement).style.display = 'none';
    (document.querySelector('.changepass') as HTMLElement).style.display = 'block';
    (document.querySelector('.pendingreq') as HTMLElement).style.display = 'none';
    (document.querySelector('.partner') as HTMLElement).style.display = 'none';

  }

  show_pending(){
    this.profileClass = {
      "buttons" : true,
      "options" : false
    };

    this.passClass = {
      "buttons" : true,
      "options" :false
    };

    this.pendingClass = {
      "buttons" : true,
      "options" :true
    };

    this.partnerClass = {
      "buttons" : true,
      "options" : false
    };


    this.title = "Pending Requests";
    //show this and hide other divisions
    (document.querySelector('.profile') as HTMLElement).style.display = 'none';
    (document.querySelector('.changepass') as HTMLElement).style.display = 'none';
    (document.querySelector('.pendingreq') as HTMLElement).style.display = 'block';
    (document.querySelector('.partner') as HTMLElement).style.display = 'none';

  }

  show_partner(){
    this.profileClass = {
      "buttons" : true,
      "options" : false
    };

    this.passClass = {
      "buttons" : true,
      "options" :false
    };

    this.pendingClass = {
      "buttons" : true,
      "options" :false
    };

    this.partnerClass = {
      "buttons" : true,
      "options" : true
    }


    this.title = "OUR PARTNERS";
    //show this and hide other divisions
    (document.querySelector('.profile') as HTMLElement).style.display = 'none';
    (document.querySelector('.changepass') as HTMLElement).style.display = 'none';
    (document.querySelector('.pendingreq') as HTMLElement).style.display = 'none';
    (document.querySelector('.partner') as HTMLElement).style.display = 'block';

  }

  accept(i,name,email){
    //i is the request number.
    //remove the request from pending and send a mail.
    var myObj = {
      id : i,
      state : true, //false if declined
      org : name,
      email: email
    }
    this.signservice.pendingReq(myObj)
    .subscribe((data)=>{ console.log(data);}
    ,(err)=> console.log(err));

    this.router.navigateByUrl('/refresh', { skipLocationChange: true}).then(() => {
      this.router.navigate([decodeURI(this.location.path())]);
    });
  }

  decline(i,name,email){
    var myObj = {
      id : i,
      state : false,
      name : name,
      email: email
    }
    this.signservice.pendingReq(myObj)
    .subscribe((data)=>{ console.log(data);}
    ,(err)=> console.log(err));

    this.router.navigateByUrl('/refresh', { skipLocationChange: true}).then(() => {
      this.router.navigate([decodeURI(this.location.path())]);
    });
  }

}