import { Component, OnInit, Input } from '@angular/core';
import NodeInfo from './shape-info';

@Component({
  selector: '[app-nodes-chart-shape]',
  templateUrl: './nodes-chart-shape.component.html',
  styleUrls: ['./nodes-chart-shape.component.less']
})
export class NodesChartShapeComponent implements OnInit {
  @Input() info: NodeInfo;
  @Input() node;

  constructor() {}

  ngOnInit() {}
}
