import { Component, OnInit, ElementRef } from '@angular/core';
import { data } from './data';
@Component({
  selector: 'app-dagre-relation',
  templateUrl: './dagre-relation.component.html',
  styleUrls: ['./dagre-relation.component.less']
})
export class DagreRelationComponent implements OnInit {
  data;
  constructor() {}

  ngOnInit() {
    setTimeout(() => {
      this.data = data;
    }, 100);
  }
}
