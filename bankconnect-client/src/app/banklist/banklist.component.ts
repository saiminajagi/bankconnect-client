import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SignupServiceService } from '../services/signup-service.service';

@Component({
  selector: 'app-banklist',
  templateUrl: './banklist.component.html',
  styleUrls: ['./banklist.component.scss']
})
export class BanklistComponent implements OnInit {
  confirmed:Number = 1;
  banklist: Array<String> = [];
  active:Number;
  email: String;
  org : String;

  constructor(private router: Router,private route: ActivatedRoute,private signservice : SignupServiceService) {
    this.signservice.getConfirmation()
    .subscribe((data) => {
      console.log(data);
      this.confirmed = data;
    },(err)=> console.log(err));
   }

  ngOnInit() {
    this.signservice.getBanks()
    .subscribe((data)=>{
      console.log("data is: "+JSON.stringify(data));
      this.banklist = data;
    },(err)=> console.log(err));

    this.signservice.getPartnerDetails()
    .subscribe((data)=>{
      console.log(data);
      this.org = data.org;
      this.email = data.email;
      this.active = data.active;
    },(err)=>console.log(err));

  }

  setBank(bankname){
    this.router.navigateByUrl(`/apilist/${bankname}`);
  }

  onboard(bankname){
    console.log("onboarding to :"+bankname);
    this.signservice.checkFileUpload()
    .subscribe((data)=>{
      console.log(data);
      if(data == 0){
        window.location.href = "http://ibm.bankconnect:5000/route/showFileForm";
      }else{
        //send the request to the bank. if he accepts then send a mail with the necessary docs to him
        var myObj = {
          org : this.org,
          email : this.email
        }
        this.signservice.sendReq(myObj)
        .subscribe((data)=>console.log(data),(err)=>console.log(err));

        console.log("files already uploaded");
      }
    },(err)=>console.log(err));
  }
}
