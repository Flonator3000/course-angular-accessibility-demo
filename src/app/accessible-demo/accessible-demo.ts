import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';

@Component({
  selector: 'app-accessible-demo',
  templateUrl: './accessible-demo.html',
  styleUrls: ['./accessible-demo.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccessibleDemoComponent {
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
  }
}
