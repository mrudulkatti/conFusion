import { Component, OnInit, Input, ViewChild, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { dishfeed } from '../shared/dishfeed';
import { baseURL } from '../shared/baseurl';

@Component({
    selector: 'app-dishdetails',
    templateUrl: './dishdetails.component.html',
    styleUrls: ['./dishdetails.component.scss']
})

export class DishdetailsComponent implements OnInit {

    dish: Dish;
    dishIds: string[]
    prev: string;
    next: string;
    errMess: string;

    dishFeedback: FormGroup;
    dishFeed: dishfeed;
    dishcopy: Dish;

    @ViewChild('fform') dishFeedbackDirective;

    constructor(private dishService: DishService, 
      private location: Location,
      private route: ActivatedRoute, private fb: FormBuilder,
      @Inject('BaseURL') public BaseURL) {
       this.createForm();
      }
 

    formErrors = {
      'name': '',
      'rating': 5,
      'comm': ''
    };
  
    validationMessages = {
      'name': {
        'required': 'Author Name is required.',
        'minlength': 'Author Name must be at least 2 characters long.',
        'maxlength': 'Author Name cannot be more that 25 characters long.',
      },
      'comm': {
        'required': 'Comment is required.',
      }
    };

    createForm(){
      this.dishFeedback = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
        rating: '',
        comm: ['',  [Validators.required]],
      });
  
      this.dishFeedback.valueChanges
        .subscribe(data => this.onValueChanged(data));
    
      this.onValueChanged(); //reset form validation messages 
  }
    

  ngOnInit() { 
    this.dishService.getDishIds()
    .subscribe((dishIds) => this.dishIds = dishIds);

    this.route.params
    .pipe(switchMap((params:Params) => this.dishService.getDish(params['id'])))
    .subscribe((dish)=>{ this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id);},
     errmess => this.errMess = <any>errmess);
  }

  onValueChanged(data?: any){
    if(!this.dishFeedback) { return; }
    const form = this.dishFeedback;
    for ( const field in this.formErrors) {
      if(this.formErrors.hasOwnProperty(field)){
        //clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if(control && control.dirty && !control.valid){
          const messages = this.validationMessages[field];
          for (const key in control.errors){
            if(control.errors.hasOwnProperty(key)){
              this.formErrors[field] += messages[key]
            }
          }
        }
      }
    }
  }

  onSubmit(){
    this.dishFeed = this.dishFeedback.value;
    console.log(this.dishFeed);
    this.dishcopy.comments.push({rating: this.dishFeedback.value.rating,
      comment: this.dishFeedback.value.comm,
      author: this.dishFeedback.value.name,
      date: (new Date()).toISOString()});
      this.dishService.putDish(this.dishcopy)
      .subscribe(dish => {
        this.dish = dish;
        this.dishcopy = dish;
      },
      errmess => { this.dish = null; this.dishcopy = null; this.errMess = <any>errmess; } );
    this.dishFeedback.reset({
      name: '',
      rating: 5,
      comm: '',
    });
    this.dishFeedbackDirective.resetForm();
  }


  setPrevNext(dishId: string){
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }
  goBack(): void{
    this.location.back();
  }



}
