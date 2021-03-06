import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { GalleryItemInternal } from 'projects/gallery/src/lib/core/gallery-item';
import {
  GalleryComponent,
  GalleryItem,
  GalleryItemEvent,
} from 'projects/gallery/src/public-api';
import { defer, Observable, of } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-demo-whole-config',
  templateUrl: './demo-whole-config.component.html',
  styleUrls: ['./demo-whole-config.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoWholeConfig implements OnInit {
  @Input() images: GalleryItem[];
  items: Observable<GalleryItem[]>;

  displayGallery = true;
  imageLoadingLatency = 0;

  mobile = matchMedia('(max-width: 767px)').matches;

  galleryConfig = {
    selectedIndex: 0,
    arrows: !this.mobile,
    descriptions: false,
    mouseGestures: true,
    touchGestures: true,
    counter: true,
    counterOrientation: 'bottom',
    itemWidth: '',
    objectFit: 'cover',
    loading: 'lazy',
    loop: false,
    rtl: false,
    thumbs: true,
    thumbsAutoScroll: true,
    thumbsOrientation: 'bottom',
    thumbsArrows: true,
    thumbsArrowSlideByLength: 0,
    thumbsScrollBehavior: 'smooth',
  };

  @ViewChild(GalleryComponent, { static: false }) gallery: GalleryComponent;

  constructor(private cd: ChangeDetectorRef) {
    this.galleryConfig = this.getGalleryConfig() || this.galleryConfig;
  }

  ngOnInit() {
    this.items = of(this.images).pipe(
      switchMap(items =>
        defer(() => of(items).pipe(delay(this.imageLoadingLatency)))
      )
    );

    window.addEventListener('pagehide', this.storeGalleryConfig);
  }

  async onImageClick(event: GalleryItemEvent) {}

  onImageLoad() {}

  reloadGallery() {
    this.displayGallery = false;
    this.cd.detectChanges();
    this.images.forEach((i: GalleryItemInternal) => {
      i._loaded = false;
    });
    this.displayGallery = true;
    this.cd.detectChanges();
  }

  private getGalleryConfig() {
    return JSON.parse(sessionStorage.getItem('galleryConfig'));
  }

  private storeGalleryConfig = () => {
    sessionStorage.setItem('galleryConfig', JSON.stringify(this.galleryConfig));
  };
}
