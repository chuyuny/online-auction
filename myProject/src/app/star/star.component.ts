import {Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import {t} from '@angular/core/src/render3';

@Component({
  selector: 'app-star',
  templateUrl: './star.component.html',
  styleUrls: ['./star.component.css']
})
export class StarComponent implements OnInit,OnChanges{

  @Input() private rating:number=0;
  private stars:boolean[];
  @Output() private ratingChange :EventEmitter<number> = new EventEmitter();
  @Input() private readonly :boolean = true;
  constructor() { }

  ngOnInit() {

  }
  clickStar(index:number){
    if(!this.readonly){
      this.rating = index+1;
      this.ratingChange.emit(this.rating);
    }

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.stars=[];
    for (let i=1;i<=5;i++){
      this.stars.push(i>this.rating);
    }
  }

}
