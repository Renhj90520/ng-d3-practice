import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import ShapeInfo from '../nodes-chart-shape/shape-info';

@Component({
  selector: '[app-nodes-chart-node]',
  templateUrl: './nodes-chart-node.component.html',
  styleUrls: ['./nodes-chart-node.component.less']
})
export class NodesChartNodeComponent implements OnInit {
  @Input() node;
  @Output() onNodeClicked = new EventEmitter<any>();
  shapeInfo: ShapeInfo;

  labelOffsetY = 28;
  constructor() {}

  ngOnInit() {
    this.shapeInfo = {
      type: 'hexagon',
      color: '#2086bf',
      scale: 55
    };
  }
  onClick() {
    this.node.isSelected = true;
    this.onNodeClicked.emit(this.node);
  }
  onMouseEnter() {
    this.node.isHighlighted = true;
  }
  onMouseLeave() {
    this.node.isHighlighted = false;
  }
}
