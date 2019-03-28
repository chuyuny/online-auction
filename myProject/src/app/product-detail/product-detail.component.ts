import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Comment, Product, ProductService} from '../shared/product.service';
import {WebsocktService} from '../shared/websockt.service';
import {map} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {el} from '@angular/platform-browser/testing/src/browser_util';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product:Product;
  comments:Comment[];
  private newRating:number =5;
  private newComment:string;
  private isCommentHidden :boolean = true;
  private isWatched:boolean =false;
  private currentBid:number;
  private subscription:Subscription;
  constructor(private routeInfo:ActivatedRoute,private ProductService:ProductService,private wsService:WebsocktService) { }

  ngOnInit() {
    let productId:number =this.routeInfo.snapshot.params['productId'];
    this.ProductService.getProduct(productId).subscribe(
      product => {
        this.product = product;
        this.currentBid = product.price;
      }
    );
    this.ProductService.getCommentForProduct(productId).subscribe(
      comments => this.comments = comments
    );;

  }
  addComment(){
    let comment =new Comment(1,this.product.id,new Date().toISOString(),'me',this.newRating,this.newComment);
    this.comments.unshift(comment);
    let sum = this.comments.reduce((sum,comment)=>sum+comment.rating,0);
    this.product.rating = sum/this.comments.length;

    this.newRating = 5;
    this.newComment = null;
    this.isCommentHidden =true;
  }
  private test:any;
  watchProduct(){
    if(this.subscription){
      this.subscription.unsubscribe();
      this.isWatched = false;
      this.subscription = null;
    }else {
      this.isWatched = true;
      this.subscription = this.wsService.creatObservableSockt('ws://localhost:8085',this.product.id)
        .subscribe(
          products =>{
            let product = products.find(p => p.productId === this.product.id)
            this.currentBid = product.bid
          }
        )
    }


  }

}
