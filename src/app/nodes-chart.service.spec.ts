import { TestBed } from '@angular/core/testing';

import { NodesChartService } from './nodes-chart.service';

describe('NodesChartService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NodesChartService = TestBed.get(NodesChartService);
    expect(service).toBeTruthy();
  });
});
