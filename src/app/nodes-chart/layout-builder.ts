import DagreLayout from './dagre-layout';
import * as d3Shape from 'd3-shape';
import * as d3Zoom from 'd3-zoom';
import { scaleThreshold } from 'd3-scale';
import { TweenLite, TimelineLite, Power3 } from 'gsap';
export default class LayoutBuilder {
  data;
  nodes = [];
  edges = [];
  graphInfo;
  tWidth;
  tHeight;

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

  nodeSelected(node, svg, timeline, offsetX, offsetY) {
    node.z = 1;
    const svgNode = svg.node();
    const boundingRect = svgNode.getBoundingClientRect();
    const width = boundingRect.width;
    const height = boundingRect.height;
    const centerX = (width - 420 - 60) / 2 + this.tWidth - offsetX;
    const centerY = height / 2 + this.tHeight - offsetY;

    // 100: node's size
    const xFactor = width / (this.graphInfo.width + 100);
    const yFactor = height / (this.graphInfo.height + 100);

    const scale = Math.min(xFactor, yFactor) * 0.9;

    const translateX = (width - this.graphInfo.width * scale) / 2;
    const translateY = (height - this.graphInfo.height * scale) / 2;

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

  fitToContainer(svg, zoom) {
    const padding = 20;
    const clientWidth = svg._groups[0][0].clientWidth;
    const clientHeight = svg._groups[0][0].clientHeight;
    const verticalScale = (clientHeight - 2 * padding) / this.graphInfo.height;
    const horizontalScale = (clientWidth - 2 * padding) / this.graphInfo.width;
    const initialScale = Math.min(verticalScale, horizontalScale);
    this.tWidth = (clientWidth - this.graphInfo.width * initialScale) / 2;
    this.tHeight = (clientHeight - this.graphInfo.height * initialScale) / 2;
    svg.call(
      zoom.transform,
      d3Zoom.zoomIdentity
        .translate(this.tWidth, this.tHeight)
        .scale(initialScale)
    );
  }
}
