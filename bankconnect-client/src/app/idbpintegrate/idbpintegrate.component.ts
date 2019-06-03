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
  token: String = '';
  integrationInputForm: FormGroup;

  constructor(private fb: FormBuilder, private signservice: SignupServiceService) { }

  ngOnInit() {
    this.integrationInputForm = this.fb.group({
      serverip:['',[Validators.required]],
      serverport:['',[Validators.required]],
      tlsname:['',[Validators.required]],
      tlsversion:['',[Validators.required]]
    });
  }

  onSubmit(){
    this.token = 'weijd67wuyfiyi84fo4d39rdewdo0ur3';
    console.log(this.token);
    var myObj = {
      sip : this.integrationInputForm.controls.serverip.value,
      sport: this.integrationInputForm.controls.serverport.value,
      tlsname: this.integrationInputForm.controls.tlsname.value,
      tlsversion: this.integrationInputForm.controls.tlsversion.value
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
