import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: '[app-nodes-chart-edge]',
  templateUrl: './nodes-chart-edge.component.html',
  styleUrls: ['./nodes-chart-edge.component.less']
})
export class NodesChartEdgeComponent implements OnInit {
  @Input() edge;
  isHighlighted = false;
  constructor() {}

  ngOnInit() {}
  handleMouseEnter() {
    this.isHighlighted = true;
  }
  handleMouseLeave() {
    this.isHighlighted = false;
  }
}
