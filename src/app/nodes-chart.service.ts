import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NodesChartService {
  fitToContent = new EventEmitter();
  constructor() {}
}
