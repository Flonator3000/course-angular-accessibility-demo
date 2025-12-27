import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';

@Component({
  selector: 'app-accessible-demo',
  templateUrl: './accessible-demo.html',
  styleUrls: ['./accessible-demo.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccessibleDemoComponent {
  isMenuOpen = false;
  showNotification = false;
  imageUrl = 'team.png';
  
  usernameLabel = 'Enter your new username';
  passwordLabel = 'Enter your password';

  constructor(private cdr: ChangeDetectorRef) { }

  save() {
    this.showNotification = true;
    setTimeout(() => {
      this.showNotification = false;
      this.cdr.markForCheck();
    }, 3000);
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
