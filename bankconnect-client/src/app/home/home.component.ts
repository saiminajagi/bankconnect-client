import { Component, OnInit } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [NgbCarouselConfig]
})
export class HomeComponent implements OnInit {

  Image1: any = '../../assets/carosel_home_1.jpg';
  // Image2: any = '../../assets/yesbank_carosel_2.png';
  // Image3: any = '../../assets/yesbank_carosel_3.png';

  images: Array<any> = [this.Image1];


  constructor(private router: Router, config: NgbCarouselConfig) {

    config.interval = 3000;
    config.wrap = false;
    config.keyboard = false;
    config.pauseOnHover = true;
    config.wrap = true;
   }

  ngOnInit() {
  }



}
