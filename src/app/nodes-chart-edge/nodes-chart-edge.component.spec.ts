import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodesChartEdgeComponent } from './nodes-chart-edge.component';

describe('NodesChartEdgeComponent', () => {
  let component: NodesChartEdgeComponent;
  let fixture: ComponentFixture<NodesChartEdgeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodesChartEdgeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodesChartEdgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
