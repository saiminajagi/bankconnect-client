import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SignupServiceService } from '../services/signup-service.service';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {

  transactions:any;

  constructor(private router: Router,private route: ActivatedRoute, private signservice: SignupServiceService) {
    this.transactions = this.route.snapshot.data['transactions'];
    console.log("these are the transactions as of now "+JSON.stringify(this.transactions));
  }

  ngOnInit() {
  }

}
