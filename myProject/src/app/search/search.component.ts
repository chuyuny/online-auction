import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validator, Validators} from '@angular/forms';
import {ProductSearchParams, ProductService} from '../shared/product.service';
import {HttpParams} from '@angular/common/http';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  formModel : FormGroup;
  categories:string[];
  constructor(private ProductService:ProductService ) {
    let fb = new FormBuilder();
    this.formModel = fb.group({
      title:['',Validators.minLength(3)],
      price:[null,this.positiveNumberValidator],
      category:['-1']
    })
  }

  ngOnInit() {
    this.categories = this.ProductService.getAllcategories();
  }

  positiveNumberValidator(control:FormControl):any{
    if(!control.value){
      return null;
    }
    let price = parseInt(control.value);
    if(price>0){
      return null;
    }else {
      return {positiveNumber:true};
    }
  }
  onSearch(){
    if (this.formModel.valid){
      this.ProductService.searchEvent.emit(this.formModel.value);
    }
  }

}
