import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  searchEvent:EventEmitter<ProductSearchParams> = new EventEmitter();
  constructor( private http:HttpClient) {

  }

  toStringValue(obj:any):object {
      if (obj instanceof Array) {
        var arr = [];
        for (var i = 0; i < obj.length; i++) {
          arr[i] = this.toStringValue(obj[i]);
        }
        return arr;
      } else if (typeof obj == 'object') {
        for (var p in obj) {
          obj[p] = this.toStringValue(obj[p]);
        }
      } else if (typeof obj == 'number') {
        obj = obj + '';
      }
      return obj;
  }

    getAllcategories():string[]{
   return ["蔬菜","水果","牛奶"];
  }

  getProducts():Observable<Product[]>{
    return this.http.get<Product[]>('/api/products');
  }
  getProduct(id:number): Observable<Product>{
    return this.http.get<Product>('/api/products/'+id)
  }
  getCommentForProduct(id:number): Observable<Comment[]>{
    return this.http.get<Comment[]>('/api/products/'+id+'/comments')
  }
  serch(params:ProductSearchParams): Observable<Product[]>{
    console.log(params);
    return this.http.get<Product[]>('/api/products/',{params:this.encodeParams(params)})
  }

  private encodeParams(params: ProductSearchParams) {
    return new HttpParams({fromObject:Object.keys(this.toStringValue(params))
        .filter(key => params[key])
        .reduce((obj:{},key:string) => {
          obj[key] = params[key]
          return obj;
        },{})})
  }


}


export class ProductSearchParams {
  constructor(public title:string,
              public price:number,
              public category:string){}
}
export class Product {
  constructor(
    public id: number,
    public title: string,
    public price: number,
    public rating: number,
    public desc: string,
    public categories: Array<string>
  ) {}
}

export class Comment {
  constructor(public id:number,
              public productId:number,
              public timestamp:string,
              public user:string,
              public rating:number,
              public content:string
              ) {}

}
