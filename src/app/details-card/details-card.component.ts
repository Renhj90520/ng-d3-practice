import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  Input,
  HostBinding,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import ResizeSensor from 'css-element-queries';
import { ScrollService } from '../slim-scroll/scroll.service';

@Component({
  selector: 'app-details-card',
  templateUrl: './details-card.component.html',
  styleUrls: ['./details-card.component.less']
})
export class DetailsCardComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('slim') slim;
  @HostBinding('style.display') display = 'flex';
  @Input() isShow;
  @Input() node;

  constructor(private scrollService: ScrollService) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.isShow) {
      this.display = this.isShow ? 'flex' : 'none';
    }
  }
  ngOnInit() {
    new ResizeSensor.ResizeSensor(
      this.slim.el.nativeElement.children[0],
      size => {
        this.scrollService.onSizeChange.emit();
      }
    );
  }
  ngOnDestroy(): void {
    ResizeSensor.ResizeSensor.detach(this.slim.el.nativeElement.children[0]);
  }
}
