import DagreLayout from './dagre-layout';
import * as d3Shape from 'd3-shape';
import { scaleThreshold } from 'd3-scale';
import { TweenLite, TimelineLite, Power3 } from 'gsap';
export default class LayoutBuilder {
  data;
  nodes = [];
  edges = [];
  graphInfo;

  radiusDesnity = scaleThreshold()
    .domain([3, 6])
    .range([2.5, 3, 2.5]);

  pathFun = d3Shape
    .line()
    .curve(d3Shape.curveBasis)
    .x(d => d[0])
    .y(d => d[1]);
  constructor(data) {
    this.data = data;
    this.initData();
  }

  private initData() {
    const dataCopy = JSON.parse(JSON.stringify(this.data));
    this.recursiveBuildNodesAndEdges(dataCopy);
  }
  private recursiveBuildNodesAndEdges(node, parent?) {
    if (parent) {
      this.edges.push({
        id: `${parent.name}--${node.name}`,
        start: parent.name,
        end: node.name,
        elType: 'edge'
      });
    }
    node.elType = 'node';
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

  doLayout() {
    const dagreLayout = new DagreLayout(this.nodes, this.edges);
    this.graphInfo = dagreLayout.doLayout();
    this.edges.forEach(edge => {
      const points = edge.points.map(ps => [ps.x, ps.y]);

      edge.path = this.pathFun(points);
      edge.thickness = 1;
    });

    this.nodes.forEach(node => {
      node.isSelected = false;
    });

    return this.edges.concat(this.nodes);
  }

  nodeSelected(node, svg, timeline) {
    node.z = 1;
    const svgNode = svg.node();
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
    timeline.add(
      TweenLite.to(`#${node.name}`, 0.5, {
        ease: Power3.easeInOut,
        x: node.x,
        y: node.y
      }),
      0
    );
    let adjacentEdges = this.getAdjacentEdges(node);
    const adjacentNodes = this.getAdjacentNodes(node, adjacentEdges);
    adjacentNodes.forEach(n => {
      const edges = this.edges.filter(
        e =>
          (e.start === n || e.end === n) &&
          adjacentEdges.indexOf(innerE => innerE.id === e.id) < 0
      );
      adjacentEdges = adjacentEdges.concat(edges);
    });

    const circularOffsetAngle = Math.PI / 4;
    const widthWithDetail = width - 420;

    const expanse = Math.min(widthWithDetail, height);
    const maxScale = expanse / 100 / 2;
    const shrinkFactor = Math.sqrt(adjacentNodes.length + 10);
    const selectedScale = maxScale / shrinkFactor / scale;

    const circularRadius =
      expanse / this.radiusDesnity(adjacentNodes.length) / scale;
    const circularInnerAngle = (2 * Math.PI) / adjacentNodes.length;

    this.nodes.forEach(n => {
      const idx = adjacentNodes.indexOf(n.name);
      if (idx >= 0) {
        const angle = circularOffsetAngle + idx * circularInnerAngle;
        n.x = node.x + circularRadius * Math.sin(angle);
        n.y = node.y + circularRadius * Math.cos(angle);
        n.z = 1;
        timeline.add(
          TweenLite.to(`#${n.name}`, 0.5, {
            ease: Power3.easeInOut,
            x: n.x,
            y: n.y
          }),
          0
        );
      } else {
        if (n.name !== node.name) {
          n.z = -1;
        }
      }
    });

    adjacentEdges.forEach(edge => {
      const edgeOrigin = this.edges.find(e => e.id === edge.id);
      const source = this.nodes.find(node => node.name === edgeOrigin.start);
      const target = this.nodes.find(node => node.name === edge.end);
      edgeOrigin.path = this.pathFun([
        [source.x, source.y],
        [target.x, target.y]
      ]);

      timeline.add(
        TweenLite.to(`#${edgeOrigin.id} .link`, 0.5, {
          ease: Power3.easeInOut,
          attr: { d: edgeOrigin.path }
        }),
        0
      );
    });

    timeline.play();
    return this.edges
      .filter(edge => edge.z === -1)
      .concat(this.nodes.filter(node => node.z === -1))
      .concat([{ elType: 'overlay' }])
      .concat(this.edges.filter(edge => edge.z === 1))
      .concat(this.nodes.filter(node => node.z === 1));
  }
  getAdjacentEdges(node) {
    const edges = [];
    this.edges.forEach(edge => {
      if (edge.start === node.name || edge.end === node.name) {
        edge.z = 1;
        edges.push(edge);
      } else {
        edge.z = -1;
      }
    });
    return edges;
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
