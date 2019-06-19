import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SignupServiceService } from '../services/signup-service.service';

@Component({
  selector: 'app-apilist',
  templateUrl: './apilist.component.html',
  styleUrls: ['./apilist.component.scss']
})
export class ApilistComponent implements OnInit {

  Apilist: Array<String> = [];
  constructor(private router: Router,private route: ActivatedRoute,private signservice : SignupServiceService) {
    this.route.params.subscribe( params => {
      console.log("bank name is: "+params['bankname']);
      var myObj = {
        bank : params['bankname']
      }

    this.signservice.getApis(myObj)
    .subscribe((data)=>{
      console.log("data is: "+data);
      this.Apilist = data;
    },(err)=> console.log(err));
    })
   }

  ngOnInit() {
  }

  setApi(apiname){
    this.router.navigateByUrl(`/overview/${apiname}`);
  }
}
