import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlimScrollComponent } from './slim-scroll.component';

describe('SlimScrollComponent', () => {
  let component: SlimScrollComponent;
  let fixture: ComponentFixture<SlimScrollComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlimScrollComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlimScrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
