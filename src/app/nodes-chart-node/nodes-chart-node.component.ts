import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: '[app-nodes-chart-node]',
  templateUrl: './nodes-chart-node.component.html',
  styleUrls: ['./nodes-chart-node.component.less']
})
export class NodesChartNodeComponent implements OnInit {
  @Input() node;

  labelOffsetY = 28;
  constructor() {}

  ngOnInit() {}
  onClick(ref) {}
  onMouseEnter(ref) {}
  onMouseLeave(ref) {}
}
