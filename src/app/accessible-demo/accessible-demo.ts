import { Component } from '@angular/core';

@Component({
  selector: 'app-accessible-demo',
  templateUrl: './accessible-demo.html',
  styleUrls: ['./accessible-demo.css'],
})
export class AccessibleDemoComponent {
  isMenuOpen = false;
  showNotification = false;

  imageUrl = 'assets/team.jpg';

  save() {
    this.showNotification = true;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
