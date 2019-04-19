import {
  Component,
  OnInit,
  AfterViewInit,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import * as d3 from 'd3-selection';
import * as d3Zoom from 'd3-zoom';
import { NodesChartService } from '../nodes-chart.service';
import LayoutBuilder from './layout-builder';
import { TimelineLite, TweenLite, Power3 } from 'gsap';
import {
  trigger,
  state,
  transition,
  animate,
  style
} from '@angular/animations';
@Component({
  selector: 'app-nodes-chart',
  templateUrl: './nodes-chart.component.html',
  styleUrls: ['./nodes-chart.component.less'],
  host: {
    '[class.nodes-chart]': 'true'
  },
  animations: [
    trigger('slide', [
      state('slidein', style({ opacity: 1, transform: 'translate(0,0px)' })),
      state('slideout', style({ opacity: 0, transform: 'translate(0,-30px)' })),
      transition('slidein<=>slideout', animate('300ms ease-in-out'))
    ])
  ]
})
export class NodesChartComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() minScale = 1;
  @Input() maxScale = 1;
  @Input() data;
  slideState = 'slideout';

  isShowDetail = false;
  currentNodeForDetail;

  svg;
  container;
  zoom;

  isShowOverlay = false;

  layoutBuilder;
  elements = [];
  timeline: TimelineLite;
  initTimeline;

  offsetX;
  offsetY;

  constructor(private nodesChartService: NodesChartService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data && this.data) {
      this.layoutBuilder = new LayoutBuilder(this.data);
      this.elements = this.layoutBuilder.doLayout();
      setTimeout(() => {
        this.initTimeline = new TimelineLite();
        this.elements.forEach(element => {
          if (element.elType === 'node') {
            this.initTimeline.add(
              TweenLite.to(`#${element.name}`, 0.5, {
                ease: Power3.easeInOut,
                x: element.x,
                y: element.y
              }),
              0
            );
          } else if (element.elType === 'edge') {
            this.initTimeline.add(
              TweenLite.to(`#${element.id} .link`, 0.5, {
                ease: Power3.easeInOut,
                attr: { d: element.path }
              }),
              0
            );
          }
        });
        this.initTimeline.play();
        this.layoutBuilder.fitToContainer(this.svg, this.zoom);
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
        this.offsetX = d3.event.transform.x;
        this.offsetY = d3.event.transform.y;
      });

    this.svg.call(this.zoom);
  }

  nodeSelected(node) {
    if (this.currentNodeForDetail) {
      this.currentNodeForDetail.isSelected = false;
    }
    this.isShowDetail = true;
    this.currentNodeForDetail = node;
    this.slideState = 'slidein';
    if (!this.timeline) {
      this.timeline = new TimelineLite({
        onReverseComplete: this.reverseComplete.bind(this, node)
      });
      this.elements = this.layoutBuilder.nodeSelected(
        node,
        this.svg,
        this.timeline,
        this.offsetX,
        this.offsetY
      );
    } else {
      this.timeline.reverse().timeScale(100);
    }
  }
  restoreLayout() {
    this.slideState = 'slideout';
    this.isShowDetail = false;
    this.currentNodeForDetail = null;
    this.elements = this.layoutBuilder.doLayout();
    this.timeline.reverse();
  }

  reverseComplete() {
    if (this.currentNodeForDetail) {
      this.timeline.clear();
      this.timeline.timeScale(1);
      this.elements = this.layoutBuilder.nodeSelected(
        this.currentNodeForDetail,
        this.svg,
        this.timeline,
        this.offsetX,
        this.offsetY
      );
      this.isShowDetail = true;
      this.slideState = 'slidein';
    }
  }
}
