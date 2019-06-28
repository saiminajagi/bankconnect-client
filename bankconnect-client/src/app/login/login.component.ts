import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SignupServiceService } from '../services/signup-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  loginForm1: FormGroup; // fintech or bank
  loginForm2: FormGroup; // regulatory board
  sent = 0;

  constructor(private fb: FormBuilder, private signservice: SignupServiceService, private router: Router) { }

  ngOnInit() {

    // from group for fintech/bank
    this.loginForm1 = this.fb.group({
      email1: ['', [Validators.required]],
      pass1: ['', [Validators.required]],
    });

    // form group for regulatory board
    this.loginForm2 = this.fb.group({
      email2: ['', [Validators.required]],
      pass2: ['', [Validators.required]],
    });
  }

  onSubmit(id) {

    if (id === 1) {
      var myObj = {
        email: this.loginForm1.controls.email1.value,
        pass: this.loginForm1.controls.pass1.value
      }
    } else {
      var myObj = {
        email: this.loginForm2.controls.email2.value,
        pass: this.loginForm2.controls.pass2.value
      };
    }

    this.signservice.sendLoginDetails(myObj)
      .subscribe(
        (data: any) => {
          if (data.status) {
            window.location.href = 'http://ibm.bankconnect:5000/home';
          } else {
            alert(data.msg);
          }
        },
        (error: any) => console.log('error')
      );
  }

}
