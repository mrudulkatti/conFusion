import { Component, OnInit, Inject } from '@angular/core';
import { leader } from '../shared/leader';
import { LeadersService } from '../services/leaders.service'
import { flyInOut, expand } from '../animations/app.animation';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  host:{
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [
    flyInOut(),
    expand()
  ]

})
export class AboutComponent implements OnInit {

  leaders: leader[];
  constructor(private leadersService: LeadersService, 
    @Inject('BaseURL') public BaseURL) { }

  ngOnInit() {
    this.leadersService.getLeaders()
    .subscribe((leaders)=>this.leaders = leaders);
  }

}
