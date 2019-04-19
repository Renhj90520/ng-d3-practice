import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodesChartStackshapeComponent } from './nodes-chart-stackshape.component';

describe('NodesChartStackshapeComponent', () => {
  let component: NodesChartStackshapeComponent;
  let fixture: ComponentFixture<NodesChartStackshapeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodesChartStackshapeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodesChartStackshapeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
