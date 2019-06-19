import { Component, OnInit } from '@angular/core';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { SignupServiceService} from '../services/signup-service.service';


@Component({
  selector: 'app-createbankaccount',
  templateUrl: './createbankaccount.component.html',
  styleUrls: ['./createbankaccount.component.scss']
})
export class CreatebankaccountComponent implements OnInit {

  sent: Number = 0;
  createBankAccountForm: FormGroup;
  allBanks: Array<any> = [
    {value: 'YBL' , viewValue: 'YBL'},
    {value: 'ICICI' , viewValue: 'ICICI'},
    {value: 'RBL' , viewValue: 'RBL'},
    {value: 'Canara' , viewValue: 'Canara'}
  ];

  constructor(private fb: FormBuilder, private signservice: SignupServiceService) { }

  ngOnInit() {
    this.createBankAccountForm = this.fb.group({
      bankname:['',[Validators.required]],
      email:['',[Validators.required]],
      pass:['',[Validators.required]],
    });
  }

  onSubmit(){
    var myObj = {
      bankname: this.createBankAccountForm.controls.bankname.value,
      email: this.createBankAccountForm.controls.email.value,
      pass: this.createBankAccountForm.controls.pass.value,
    };

    this.signservice.sendBankAccountDetails(myObj)
  .subscribe(
    (data : any) => {
      console.log(data);
      this.sent = 1;
    },
    (error: any) => console.log('error')
  );
  }

}
