import { Component, OnInit } from '@angular/core';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { SignupServiceService} from '../services/signup-service.service';

@Component({
  selector: 'app-idbpintegrate',
  templateUrl: './idbpintegrate.component.html',
  styleUrls: ['./idbpintegrate.component.scss']
})
export class IdbpintegrateComponent implements OnInit {

  sent: Number = 0;
  integrationInputForm: FormGroup;

  constructor(private fb: FormBuilder, private signservice: SignupServiceService) { }

  ngOnInit() {
    this.integrationInputForm = this.fb.group({
      serverip:['',[Validators.required]],
      serverport:['',[Validators.required]],
      tlsname:['',[Validators.required]],
      tlsversion:['',[Validators.required]]
      // tlscertificate:['']
    });
  }

  onSubmit(){
    var myObj = {
      admin : this.integrationInputForm.controls.admin.value,
      email: this.integrationInputForm.controls.email.value,
      pass: this.integrationInputForm.controls.pass.value,
    };

    this.signservice.sendIDBPIntegrationDetails(myObj)
  .subscribe(
    (data : any) => {
      console.log(data);
      this.sent = 1;
    },
    (error: any) => console.log('error')
  );
  }

}
