import {
  Component,
  OnInit,
  AfterViewInit,
  Input,
  OnDestroy,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import * as d3 from 'd3-selection';
import * as d3Zoom from 'd3-zoom';
import * as d3Shape from 'd3-shape';
import { scaleThreshold } from 'd3-scale';
import { NodesChartService } from '../nodes-chart.service';
import LayoutBuilder from './layout-builder';
@Component({
  selector: 'app-nodes-chart',
  templateUrl: './nodes-chart.component.html',
  styleUrls: ['./nodes-chart.component.less'],
  host: {
    '[class.nodes-chart]': 'true'
  }
})
export class NodesChartComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() minScale = 1;
  @Input() maxScale = 1;
  @Input() data;

  @Output() nodeClicked = new EventEmitter<any>();

  svg;
  container;
  zoom;

  isShowOverlay = false;

  layoutBuilder;
  elements = [];

  constructor(private nodesChartService: NodesChartService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data && this.data) {
      this.layoutBuilder = new LayoutBuilder(this.data);
      this.elements = this.layoutBuilder.doLayout();
      this.fitToContainer();
    }
  }
  ngOnInit() {}
  ngAfterViewInit(): void {
    this.initD3();
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
    const verticalScale =
      (clientHeight - 2 * padding) / this.layoutBuilder.graphInfo.height;
    const horizontalScale =
      (clientWidth - 2 * padding) / this.layoutBuilder.graphInfo.width;
    const initialScale = Math.min(verticalScale, horizontalScale);
    const tWidth =
      (clientWidth - this.layoutBuilder.graphInfo.width * initialScale) / 2;
    const tHeight =
      (clientHeight - this.layoutBuilder.graphInfo.height * initialScale) / 2;
    this.svg.call(
      this.zoom.transform,
      d3Zoom.zoomIdentity.translate(tWidth, tHeight).scale(initialScale)
    );
  }

  nodeSelected(node) {
    this.elements = this.layoutBuilder.nodeSelected(node, this.svg);
  }
  restoreLayout() {
    this.elements = this.layoutBuilder.doLayout();
  }
}
