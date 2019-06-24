import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SignupServiceService} from '../services/signup-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  sent =0;

  constructor(private fb: FormBuilder, private signservice: SignupServiceService,private router: Router) { }

  ngOnInit() {
    this.signservice.destroySession()
    .subscribe((data)=>{
      console.log(data);
    },(err)=>console.log(err));
    
    this.loginForm = this.fb.group({
      email:['',[Validators.required]],
      pass:['',[Validators.required]],
    });
  }

  onSubmit(){
    var myObj = {
      email: this.loginForm.controls.email.value,
      pass: this.loginForm.controls.pass.value,
    }
    this.signservice.sendLoginDetails(myObj)
    .subscribe(
    (data : any) => {
      if(data.status){
        window.location.href = 'http://localhost:5000/home';
      }else{
        alert(data.msg);
      }
    },
    (error: any) => console.log('error')
  );
  }

}
