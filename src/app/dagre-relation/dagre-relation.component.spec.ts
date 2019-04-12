import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DagreRelationComponent } from './dagre-relation.component';

describe('DagreRelationComponent', () => {
  let component: DagreRelationComponent;
  let fixture: ComponentFixture<DagreRelationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DagreRelationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DagreRelationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
