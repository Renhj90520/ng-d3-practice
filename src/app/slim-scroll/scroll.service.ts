import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  onSizeChange = new EventEmitter();
  constructor() {}
}
