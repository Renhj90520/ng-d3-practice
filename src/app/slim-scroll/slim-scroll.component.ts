import {
  Component,
  OnInit,
  HostListener,
  ElementRef,
  OnDestroy,
  Input
} from '@angular/core';
import { ScrollService } from './scroll.service';

@Component({
  selector: 'app-slim-scroll',
  templateUrl: './slim-scroll.component.html',
  styleUrls: ['./slim-scroll.component.less']
})
export class SlimScrollComponent implements OnInit, OnDestroy {
  minBarHeight = 30;
  barHeight = 30;
  isShowBar = false;
  height;
  barTop = 0;
  scrollHeight = 0;
  wheelStep = 20;

  menuOpenChangeSub$;
  treeCollapseChangeSub$;
  constructor(private el: ElementRef, private scrollService: ScrollService) {}

  ngOnInit() {
    this.scrollService.onSizeChange.subscribe(() => {
      this.calcBarHeight();
    });
    this.el.nativeElement.children[0].style.transition = 'all 300ms';
  }
  ngOnDestroy(): void {}
  calcBarHeight() {
    this.height = this.el.nativeElement.clientHeight;

    this.scrollHeight = this.el.nativeElement.children[0].clientHeight;

    if (this.scrollHeight > this.height) {
      this.isShowBar = true;

      this.barHeight = Math.max(
        (this.height / this.scrollHeight) * this.height,
        this.minBarHeight
      );
      this.barTop = Math.min(this.barTop, this.scrollHeight - this.height);
    } else {
      this.isShowBar = false;
      this.barTop = 0;
    }
    this.scrollContent();
  }
  scrollContent() {
    const percentScroll = this.barTop / (this.height - this.barHeight);
    const delta = percentScroll * (this.scrollHeight - this.height);
    this.el.nativeElement.children[0].style.marginTop = -delta + 'px';
  }
  @HostListener('mouseenter')
  onMouseEnter() {
    this.calcBarHeight();
  }
  @HostListener('mouseleave')
  onMouseLeave() {
    this.isShowBar = false;
  }

  @HostListener('mousewheel', ['$event'])
  onWheel(evt) {
    if (this.isShowBar) {
      let delta = 0;
      if (evt.wheelDelta) {
        delta = -evt.wheelDelta / 120;
      }

      const maxTop = this.height - this.barHeight;
      delta = this.barTop + ((delta * this.wheelStep) / 100) * this.barHeight;
      delta = Math.min(Math.max(delta, 0), maxTop);
      delta = Math.floor(delta);
      this.barTop = delta;

      this.scrollContent();
      evt.preventDefault();
    }
  }
}
