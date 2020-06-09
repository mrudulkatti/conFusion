import { Component, OnInit, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service'
import { Promotion } from '../shared/promotion';
import { PromotionService } from '../services/promotion.service'
import { leader } from '../shared/leader';
import { LeadersService } from '../services/leaders.service'


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  dish: Dish;
  promotion: Promotion;
  leaders: leader;
  dishErrMess: string;

  constructor(private dishService: DishService,
    private promotionService: PromotionService, private leadersService: LeadersService,
    @Inject('BaseURL') public BaseURL){ }
  
  ngOnInit(): void
  {
    this.dishService.getFeaturedDish()
    .subscribe((dish)=>this.dish=dish,
      errmess => this.dishErrMess = <any>errmess);

    this.promotionService.getFeaturedPromotion()
    .subscribe((promotion)=>this.promotion = promotion); 
    
    this.leadersService.getFeaturedLeaders()
    .subscribe((leaders)=>this.leaders = leaders); 
  }

}
