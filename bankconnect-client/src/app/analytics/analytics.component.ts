import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {

  transactions:any;

  constructor(private router: Router,private route: ActivatedRoute) {
    this.transactions = this.route.snapshot.data['transactions'];
    console.log("these are the transactions as of now "+this.transactions);
  }

  ngOnInit() {
  }

}
