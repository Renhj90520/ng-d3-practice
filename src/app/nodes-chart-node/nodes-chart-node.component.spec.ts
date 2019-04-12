import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodesChartNodeComponent } from './nodes-chart-node.component';

describe('NodesChartNodeComponent', () => {
  let component: NodesChartNodeComponent;
  let fixture: ComponentFixture<NodesChartNodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodesChartNodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodesChartNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
