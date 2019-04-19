import { Component, OnInit, Input } from '@angular/core';
import NodeInfo from './shape-info';
import { line, curveCardinalClosed } from 'd3-shape';
import { range } from 'lodash';

@Component({
  selector: '[app-nodes-chart-shape]',
  templateUrl: './nodes-chart-shape.component.html',
  styleUrls: ['./nodes-chart-shape.component.less']
})
export class NodesChartShapeComponent implements OnInit {
  @Input() info: NodeInfo;
  @Input() node;

  cloudPath =
    'M-1.25 0.233Q-1.25 0.44-1.104 0.587-0.957 0.733-0.75 0.733H0.667Q0.908 0.733 1.079 0.562 1.25 0.391 1.25 0.15 1.25-0.022 1.158-0.164 1.065-0.307 0.914-0.377q0.003-0.036 0.003-0.056 0-0.276-0.196-0.472-0.195-0.195-0.471-0.195-0.206 0-0.373 0.115-0.167 0.115-0.244 0.299-0.091-0.081-0.216-0.081-0.138 0-0.236 0.098-0.098 0.098-0.098 0.236 0 0.098 0.054 0.179-0.168 0.039-0.278 0.175-0.109 0.136-0.109 0.312z';

  hexagonPath = this.curvedUnitPolygonPath(6);
  constructor() {}

  ngOnInit() {}

  curvedUnitPolygonPath(n) {
    const curve = curveCardinalClosed.tension(0.65);
    const spline = line().curve(curve);
    const innerAngle = (2 * Math.PI) / n;
    const points: [number, number][] = [];
    range(0, n).forEach(k => {
      points.push([Math.sin(k * innerAngle), -Math.cos(k * innerAngle)]);
    });
    return spline(points);
  }
}
