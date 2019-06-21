import { Component, OnInit } from '@angular/core';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { SignupServiceService} from '../services/signup-service.service';


@Component({
  selector: 'app-adminaccountsetup',
  templateUrl: './adminaccountsetup.component.html',
  styleUrls: ['./adminaccountsetup.component.scss']
})
export class AdminaccountsetupComponent implements OnInit {

  sent: Number = 0;
  signupForm: FormGroup;

  constructor(private fb: FormBuilder, private signservice: SignupServiceService) { }

  ngOnInit() {
    this.signupForm = this.fb.group({
      org:['',[Validators.required]],
      email:['',[Validators.required]],
      pass:['',[Validators.required]],
      fname:['',[Validators.required]],
      lname:['',[Validators.required]],
    });
  }

  onSubmit(){
    var myObj = {
      fname : this.signupForm.controls.fname.value,
      lname : this.signupForm.controls.lname.value,
      org : this.signupForm.controls.org.value,
      email: this.signupForm.controls.email.value,
      pass: this.signupForm.controls.pass.value,
    };

    this.signservice.sendAdminSignUpDetails(myObj)
  .subscribe(
    (data : any) => {
      console.log(data);
      this.sent = 1;
    },
    (error: any) => console.log(error)
  );
  }

}
