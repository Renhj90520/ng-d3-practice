import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { DagreRelationComponent } from './dagre-relation/dagre-relation.component';
import { NodesChartComponent } from './nodes-chart/nodes-chart.component';
import { NodesChartNodeComponent } from './nodes-chart-node/nodes-chart-node.component';
import { NodesChartEdgeComponent } from './nodes-chart-edge/nodes-chart-edge.component';
import { NodesChartShapeComponent } from './nodes-chart-shape/nodes-chart-shape.component';

@NgModule({
  declarations: [
    AppComponent,
    DagreRelationComponent,
    NodesChartComponent,
    NodesChartNodeComponent,
    NodesChartEdgeComponent,
    NodesChartShapeComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
