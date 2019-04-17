import * as dagre from 'dagre';
import * as _ from 'lodash';
export default class DagreLayout {
  graph: dagre.graphlib.Graph;
  nodes;
  edges;
  nodeWidth;
  nodeHeight;
  constructor(nodes: any[], edges: any[], nodeWidth = 100, nodeHeight = 100) {
    this.nodes = nodes;
    this.edges = edges;
    this.nodeWidth = nodeWidth;
    this.nodeHeight = nodeHeight;
    this.graph = new dagre.graphlib.Graph()
      .setGraph({
        ranker: 'longest-path'
      })
      .setDefaultEdgeLabel(() => {
        return {};
      });
  }

  doLayout() {
    this.drawNodes();
    this.drawEdges();

    dagre.layout(this.graph);

    this.nodes.forEach(node => {
      const id = node.name;
      const graphNode = this.graph.node(id);
      if (graphNode) {
        node.x = graphNode.x;
        node.y = graphNode.y;
      }
    });

    this.edges.forEach(edge => {
      const graphEdge = this.graph.edge(edge.start, edge.end);
      if (graphEdge) {
        const source = this.nodes.find(node => node.name === edge.start);
        const target = this.nodes.find(node => node.name === edge.end);
        const points = this.correctedEdgePath(
          JSON.parse(JSON.stringify(graphEdge.points)),
          source,
          target
        );
        edge.points = points;
      }
    });

    return {
      width: this.graph.graph().width,
      height: this.graph.graph().height
    };
  }
  correctedEdgePath(points, source, target) {
    const sourcePoint = { x: source.x, y: source.y };
    const targetPoint = { x: target.x, y: target.y };
    const entrancePoint = points[points.length - 1];
    points = this.uniformSelect(points.slice(0, points.length - 1), 6);
    points.unshift(sourcePoint);
    points.push(entrancePoint);
    points.push(entrancePoint);
    points.push(targetPoint);
    return points;
  }
  uniformSelect(points, size: number) {
    if (size > points.length) {
      return points;
    }

    return _.range(size).map(idx => {
      points[
        parseInt((idx * (points.length / (size - (1 - 1e-9)))).toString(), 10)
      ];
    });
  }

  drawNodes() {
    // clear nodes in graph
    this.graph.nodes().length = 0;

    for (let i = 0; i < this.nodes.length; i++) {
      const node = this.nodes[i];
      this.graph.setNode(node.name, {
        width: this.nodeWidth,
        height: this.nodeHeight
      });
    }
  }

  drawEdges() {
    // clear edges in graph
    this.graph.edges().length = 0;
    for (let i = 0; i < this.edges.length; i++) {
      const el = this.edges[i];
      this.graph.setEdge(el.start, el.end, {
        id: el.id
      });
    }
  }
}
