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
import { NodesChartService } from '../nodes-chart.service';
import LayoutBuilder from './layout-builder';
import { TimelineLite, Timeline, TweenLite, Power3 } from 'gsap';
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
  timeline: TimelineLite;

  constructor(private nodesChartService: NodesChartService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data && this.data) {
      this.layoutBuilder = new LayoutBuilder(this.data);
      this.elements = this.layoutBuilder.doLayout();
      setTimeout(() => {
        const tl = new TimelineLite();
        this.elements.forEach(element => {
          if (element.elType === 'node') {
            tl.add(
              TweenLite.to(`#${element.name}`, 0.5, {
                ease: Power3.easeInOut,
                x: element.x,
                y: element.y
              }),
              0
            );
          } else if (element.elType === 'edge') {
            tl.add(
              TweenLite.to(`#${element.id} .link`, 0.5, {
                ease: Power3.easeInOut,
                attr: { d: element.path }
              }),
              0
            );
          }
        });
        tl.play();
        this.fitToContainer();
      }, 0);
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
    if (!this.timeline) {
      this.timeline = new TimelineLite();
    }
    this.timeline.clear();
    this.elements = this.layoutBuilder.nodeSelected(
      node,
      this.svg,
      this.timeline
    );
  }
  restoreLayout() {
    this.elements = this.layoutBuilder.doLayout();
    this.timeline.reverse();
  }
}
