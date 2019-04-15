import {
  Component,
  OnInit,
  AfterViewInit,
  Input,
  OnDestroy
} from '@angular/core';
import * as d3 from 'd3-selection';
import * as d3Zoom from 'd3-zoom';
import { NodesChartService } from '../nodes-chart.service';
@Component({
  selector: 'app-nodes-chart',
  templateUrl: './nodes-chart.component.html',
  styleUrls: ['./nodes-chart.component.less'],
  host: {
    '[class.nodes-chart]': 'true'
  }
})
export class NodesChartComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() minScale = 1;
  @Input() maxScale = 1;
  @Input() nodes = [];
  @Input() edges = [];
  @Input() graphInfo: any = {};

  svg;
  container;
  zoom;
  fitToContentSub$;
  constructor(private nodesChartService: NodesChartService) {}

  ngOnInit() {
    this.fitToContentSub$ = this.nodesChartService.fitToContent.subscribe(
      () => {
        this.fitToContainer();
      }
    );
  }
  ngAfterViewInit(): void {
    this.initD3();
  }
  ngOnDestroy(): void {
    if (this.fitToContentSub$) {
      this.fitToContentSub$.ubsubscribe();
    }
  }
  public initD3() {
    this.svg = d3.select('#canvas');
    this.container = d3.select('.zoom-content');
    this.zoom = d3Zoom
      .zoom()
      .scaleExtent([this.minScale, this.maxScale])
      .on('zoom', () => {
        this.container.attr('transform', d3.event.transform);
      });
    this.svg.call(this.zoom);
  }

  fitToContainer() {
    const padding = 20;
    const clientWidth = this.svg._groups[0][0].clientWidth;
    const clientHeight = this.svg._groups[0][0].clientHeight;
    const verticalScale = (clientHeight - 2 * padding) / this.graphInfo.height;
    const horizontalScale = (clientWidth - 2 * padding) / this.graphInfo.width;
    const initialScale = Math.min(verticalScale, horizontalScale);
    const tWidth = (clientWidth - this.graphInfo.width * initialScale) / 2;
    const tHeight = (clientHeight - this.graphInfo.height * initialScale) / 2;
    this.svg.call(
      this.zoom.transform,
      d3Zoom.zoomIdentity.translate(tWidth, tHeight).scale(initialScale)
    );
  }
}
