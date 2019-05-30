import { Component, OnInit } from '@angular/core';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { SignupServiceService} from '../services/signup-service.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-adminprofile',
  templateUrl: './adminprofile.component.html',
  styleUrls: ['./adminprofile.component.scss']
})
export class AdminprofileComponent implements OnInit {

  signupForm: FormGroup;



  show_admin_profile: Array<String> = [];

  constructor(private signservice: SignupServiceService, private route: ActivatedRoute) {
    this.show_admin_profile = this.route.snapshot.data['admin_profile'];
    console.log(this.show_admin_profile);
  }

  ngOnInit() {
  }

}
