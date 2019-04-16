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

  nodeSelected(node) {
    const svgNode = this.svg.node();
    const boundingRect = svgNode.getBoundingClientRect();
    const width = boundingRect.width;
    const height = boundingRect.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // 100: node's size
    const xMin = this.nodes
      .map(node => node.x - 100)
      .reduce((prev, next) => {
        return prev < next ? prev : next;
      });
    const xMax = this.nodes
      .map(node => node.x + 100)
      .reduce((prev, next) => {
        return prev < next ? next : prev;
      });

    const yMin = this.nodes
      .map(node => node.y - 100)
      .reduce((prev, next) => {
        return prev < next ? prev : next;
      });
    const yMax = this.nodes
      .map(node => node.y + 100)
      .reduce((prev, next) => {
        return prev < next ? next : prev;
      });

    const xFactor = width / (xMax - xMin);
    const yFactor = height / (yMax - yMin);

    const scale = Math.min(xFactor, yFactor) * 0.9;

    const translateX = (width - (xMax + xMin) * scale) / 2;
    const translateY = (height - (yMax + yMin) * scale) / 2;

    node.x = (-translateX + centerX) / scale;
    node.y = (-translateY + centerY) / scale;
    const adjacentEdges = this.getAdjacentEdges(node);
    const adjacentNodes = this.getAdjacentNodes(node, adjacentEdges);

    const circularOffsetAngle = Math.PI / 4;

    this.nodes.forEach(node => {
      const idx = adjacentNodes.indexOf(node.name);
      if (idx >= 0) {
      }
    });
  }

  getAdjacentEdges(node) {
    return this.edges.filter(
      edge => edge.start === node.name || edge.end === node.name
    );
  }

  getAdjacentNodes(node, edges) {
    const nodeIds = [];
    edges.forEach(edge => {
      if (edge.start !== node.name && nodeIds.indexOf(edge.start) < 0) {
        nodeIds.push(edge.start);
      }
      if (edge.end !== node.name && nodeIds.indexOf(edge.end) < 0) {
        nodeIds.push(edge.end);
      }
    });

    return nodeIds;
  }
}
