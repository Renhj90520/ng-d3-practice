import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { event as d3Event, select as d3Select } from 'd3-selection';
import { zoom as d3Zoom } from 'd3-zoom';
@Component({
  selector: 'app-nodes-chart',
  templateUrl: './nodes-chart.component.html',
  styleUrls: ['./nodes-chart.component.less'],
  host: {
    '[class.nodes-chart]': 'true'
  }
})
export class NodesChartComponent implements OnInit, AfterViewInit {
  @Input() minScale = 1;
  @Input() maxScale = 1;
  @Input() nodes = [];
  @Input() edges = [];
  @Input() graphInfo: any = {};

  svg;
  container;
  constructor() {}

  ngOnInit() {
    console.log('nodes-chart ngOnInit');
  }
  ngAfterViewInit(): void {
    this.initD3();
  }

  public initD3() {
    this.svg = d3Select('.zoomable-canvas #canvas');
    this.container = d3Select('.zoom-content');
    this.svg.call(
      d3Zoom()
        .scaleExtent([this.minScale, this.maxScale])
        .on('zoom', () => {
          this.container.attr('transform', d3Event.transform);
        })
    );
  }
}
