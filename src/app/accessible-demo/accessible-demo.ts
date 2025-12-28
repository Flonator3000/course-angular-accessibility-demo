import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Signal,
  signal,
  viewChild,
  WritableSignal
} from '@angular/core';

@Component({
  selector: 'app-accessible-demo',
  templateUrl: './accessible-demo.html',
  styleUrls: ['./accessible-demo.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccessibleDemoComponent {
  private menuToggleButton: Signal<ElementRef<HTMLButtonElement> | undefined> =
    viewChild<ElementRef<HTMLButtonElement>>('menuToggleButton');

  private firstMenuItem: Signal<ElementRef<HTMLAnchorElement> | undefined> =
    viewChild<ElementRef<HTMLAnchorElement>>('firstMenuItem');

  protected isMenuOpen: WritableSignal<boolean> = signal(false);
  protected showNotification: WritableSignal<boolean> = signal(false);

  protected readonly imageUrl = 'profile.png';

  protected readonly usernameLabel = 'Enter your new username';
  protected readonly passwordLabel = 'Enter your password';

  save() {
    this.showNotification.set(true);
    setTimeout(() => {
      this.showNotification.set(false);
    }, 3000);
  }

  toggleMenu() {
    this.isMenuOpen.update((value) => !value);

    setTimeout(() => {
      if (this.isMenuOpen()) {
        this.firstMenuItem()!.nativeElement.focus();
      } else {
        this.menuToggleButton()!.nativeElement.focus();
      }
    });
  }

  onMenuKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.toggleMenu();
    }
  }
}
