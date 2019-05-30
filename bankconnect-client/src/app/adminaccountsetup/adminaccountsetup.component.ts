import { Component, OnInit } from '@angular/core';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { SignupServiceService} from '../services/signup-service.service';


@Component({
  selector: 'app-adminaccountsetup',
  templateUrl: './adminaccountsetup.component.html',
  styleUrls: ['./adminaccountsetup.component.scss']
})
export class AdminaccountsetupComponent implements OnInit {

// tslint:disable-next-line: ban-types
  sent: Number = 0;
  signupForm: FormGroup;

  constructor(private fb: FormBuilder, private signservice: SignupServiceService) { }

  ngOnInit() {
    this.signupForm = this.fb.group({
      admin:['',[Validators.required]],
      email:['',[Validators.required]],
      pass:['',[Validators.required]],
    });
  }

  onSubmit(){
    var myObj = {
      admin : this.signupForm.controls.admin.value,
      email: this.signupForm.controls.email.value,
      pass: this.signupForm.controls.pass.value,
    };

    this.signservice.sendAdminSignUpDetails(myObj)
  .subscribe(
    (data : any) => {
      console.log(data);
      this.sent = 1;
    },
    (error: any) => console.log('error')
  );
  }

}
