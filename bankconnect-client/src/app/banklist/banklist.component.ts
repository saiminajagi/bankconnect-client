import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SignupServiceService } from '../services/signup-service.service';

@Component({
  selector: 'app-banklist',
  templateUrl: './banklist.component.html',
  styleUrls: ['./banklist.component.scss']
})
export class BanklistComponent implements OnInit {
  confirmed:Number;
  banklist: Array<String> = [];
  
  constructor(private router: Router,private route: ActivatedRoute,private signservice : SignupServiceService) {
    this.signservice.getConfirmation()
    .subscribe((data)=>{
      console.log(data);
      this.confirmed = data;
    },(err)=> console.log(err));

   }

  ngOnInit() {
    this.signservice.getBanks()
    .subscribe((data)=>{
      console.log("data is: "+data);
      this.banklist = data;
    },(err)=> console.log(err));

    // this.signservice.getBanks()
    // .subscribe((data)=>console.log(data),(err)=> console.log(err));
  }

  setBank(bankname){
  //   var myObj = {
  //     bank: bankname
  //   };
  //   this.signservice.setBank(myObj)
  //   .subscribe((data)=>{
  //     console.log(data);
  //   },(err)=>console.log(err));
  // }

  this.router.navigateByUrl(`/apilist/${bankname}`);
  }

}
