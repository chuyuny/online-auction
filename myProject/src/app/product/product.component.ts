import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Product, ProductService} from '../shared/product.service';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {Params} from '@angular/router';



// @ts-ignore
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit,OnChanges{

  private products: Observable<Product[]>;
  private keyWord:string;

  private titleFilter:FormControl = new FormControl();

  constructor(private ProductService:ProductService) {
    this.titleFilter.valueChanges
      .subscribe(
        value => this.keyWord =value
      );

  }

  ngOnInit() {
    this.products = this.ProductService.getProducts();

    this.ProductService.searchEvent.subscribe(
      params => this.products = this.ProductService.serch(params)
    )

  }

  ngOnChanges(changes: SimpleChanges): void {


  }
}
