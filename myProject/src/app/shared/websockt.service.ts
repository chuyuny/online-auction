import { Injectable } from '@angular/core';
import {observable, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WebsocktService {
  ws:WebSocket;
  constructor() { }
  // @ts-ignore
  creatObservableSockt(url:string,id:number) : Observable<any>{
      this.ws = new WebSocket(url);
      return (new Observable<string>(
        observable => {
          this.ws.onmessage = (event) => observable.next(event.data);
          this.ws.onerror = (event) => observable.error(event);
          this.ws.onclose = (event) => observable.complete();
          this.ws.onopen = (event) => this.seedMessage({productId:id})
        //  返回值会在取消订阅流的时候执行回调函数
          return ()=>{this.ws.close()}
        }
      )).pipe(
        map(products=>eval('(' + products + ')'))
      )
  }
  seedMessage(message:any){
    this.ws.send(JSON.stringify(message));
  }
}
