import { Component, OnInit, ElementRef } from '@angular/core';
import * as d3 from 'd3-selection';
import * as d3Zoom from 'd3-zoom';
import * as d3Shape from 'd3-shape';
import * as dagre from 'dagre';
import { data } from './data';
import * as dagreD3 from 'dagre-d3';
import DagreLayout from './dagre-layout';
@Component({
  selector: 'app-dagre-relation',
  templateUrl: './dagre-relation.component.html',
  styleUrls: ['./dagre-relation.component.less']
})
export class DagreRelationComponent implements OnInit {
  nodes = [];
  edges = [];
  graphInfo;
  constructor() {}

  ngOnInit() {
    this.initData();
    const dagreLayout = new DagreLayout(this.nodes, this.edges);
    this.graphInfo = dagreLayout.doLayout();
    console.log(this.nodes);
    console.log(this.edges);
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

  // fitToContainer() {
  //   const padding = 20;
  //   const clientWidth = this.svg._groups[0][0].clientWidth;
  //   const clientHeight = this.svg._groups[0][0].clientHeight;
  //   const verticalScale =
  //     (clientHeight - 2 * padding) / this.graph.graph().height;
  //   const horizontalScale =
  //     (clientWidth - 2 * padding) / this.graph.graph().width;
  //   const initialScale = Math.min(verticalScale, horizontalScale);
  //   const tWidth = (clientWidth - this.graph.graph().width * initialScale) / 2;
  //   const tHeight =
  //     (clientHeight - this.graph.graph().height * initialScale) / 2;
  //   this.svg.call(
  //     this.zoom.transform,
  //     d3Zoom.zoomIdentity.translate(tWidth, tHeight).scale(initialScale)
  //   );
  // }
}
