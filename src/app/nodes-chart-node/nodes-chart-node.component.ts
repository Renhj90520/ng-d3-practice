import { Component, OnInit, Input } from '@angular/core';
import NodeInfo from '../nodes-chart-shape/node-info';

@Component({
  selector: '[app-nodes-chart-node]',
  templateUrl: './nodes-chart-node.component.html',
  styleUrls: ['./nodes-chart-node.component.less']
})
export class NodesChartNodeComponent implements OnInit {
  @Input() node;
  info: NodeInfo;

  labelOffsetY = 28;
  constructor() {}

  ngOnInit() {
    this.info = {
      type: 'circle',
      isHighlighted: false,
      color: '#2086bf',
      scale: 55
    };
  }
  onClick() {}
  onMouseEnter() {
    this.info.isHighlighted = true;
  }
  onMouseLeave() {
    this.info.isHighlighted = false;
  }
}
