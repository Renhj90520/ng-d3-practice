import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodesChartShapeComponent } from './nodes-chart-shape.component';

describe('NodesChartShapeComponent', () => {
  let component: NodesChartShapeComponent;
  let fixture: ComponentFixture<NodesChartShapeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodesChartShapeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodesChartShapeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
