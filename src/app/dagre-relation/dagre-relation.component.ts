import { Component, OnInit, ElementRef } from '@angular/core';
import * as d3Shape from 'd3-shape';
import { data } from './data';
import DagreLayout from './dagre-layout';
import { NodesChartService } from '../nodes-chart.service';
@Component({
  selector: 'app-dagre-relation',
  templateUrl: './dagre-relation.component.html',
  styleUrls: ['./dagre-relation.component.less']
})
export class DagreRelationComponent implements OnInit {
  nodes = [];
  edges = [];
  graphInfo;
  constructor(private nodesChartService: NodesChartService) {}

  ngOnInit() {
    this.initData();
    const dagreLayout = new DagreLayout(this.nodes, this.edges);
    this.graphInfo = dagreLayout.doLayout();
    this.edges.forEach(edge => {
      const points = edge.points.map(ps => [ps.x, ps.y]);
      const pathFun = d3Shape
        .line()
        .curve(d3Shape.curveBasis)
        .x(d => d[0])
        .y(d => d[1]);
      edge.path = pathFun(points);
      edge.thickness = 1;
    });

    this.nodes.forEach(node => {
      node.transform = `translate(${node.x},${node.y})`;
    });
    setTimeout(() => {
      this.nodesChartService.fitToContent.emit();
    }, 0);
  }

  initData() {
    const dataCopy = JSON.parse(JSON.stringify(data));
    this.recursiveBuildNodesAndEdges(dataCopy);
  }
  recursiveBuildNodesAndEdges(node, parent?) {
    if (parent) {
      this.edges.push({
        id: `${parent.name}->${node.name}`,
        start: parent.name,
        end: node.name
      });
    }
    if (node.children && node.children.length > 0) {
      node.children.forEach(c => {
        this.recursiveBuildNodesAndEdges(c, node);
      });
      delete node.children;
      this.nodes.push(node);
    } else {
      this.nodes.push(node);
    }
  }
}
