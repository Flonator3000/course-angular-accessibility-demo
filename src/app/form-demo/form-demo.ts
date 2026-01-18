import {
  ChangeDetectionStrategy,
  Component,
  signal,
  WritableSignal,
  effect,
  HostListener,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface User {
  name: string;
  age: number;
}

@Component({
  selector: 'app-a11y-demo',
  templateUrl: './form-demo.html',
  styleUrls: ['./form-demo.css'],
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormDemo {
  protected email: WritableSignal<string> = signal('');
  protected password: WritableSignal<string> = signal('');
  protected errorMessage: WritableSignal<string> = signal('');

  protected notificationsEnabled: WritableSignal<boolean> = signal(false);

  /* Dropdown */
  protected isDropdownOpen: WritableSignal<boolean> = signal(false);
  protected selectedOption: WritableSignal<string | null> = signal(null);
  protected readonly options = ['Daily', 'Weekly', 'Monthly'];
  protected activeOptionIndex: WritableSignal<number> = signal(0);

  /* Menu */
  protected isMenuOpen: WritableSignal<boolean> = signal(false);
  protected activeMenuIndex: WritableSignal<number> = signal(0);
  protected readonly menuItems = ['Home', 'Profile', 'Settings'];

  /* Modal */
  protected isModalOpen: WritableSignal<boolean> = signal(false);
  protected lastFocusedElement: WritableSignal<HTMLElement | null> = signal(null);

  /* Announcements */
  protected announcement: WritableSignal<string> = signal('');

  protected users: WritableSignal<User[]> = signal([
    { name: 'Alice', age: 30 },
    { name: 'Bob', age: 24 },
    { name: 'Charlie', age: 42 },
  ]);

  protected submitForm(): void {
    if (!this.email() || !this.password()) {
      this.errorMessage.set('Invalid input');
    } else {
      this.errorMessage.set('');
      this.announcement.set('Form submitted successfully');
    }
  }

  protected toggleNotifications(): void {
    this.notificationsEnabled.update(value => !value);
    this.announcement.set(
      `Notifications ${this.notificationsEnabled() ? 'enabled' : 'disabled'}`,
    );
  }

  protected toggleDropdown(): void {
    this.isDropdownOpen.update(open => !open);
    this.activeOptionIndex.set(0);
  }

  protected selectOption(option: string): void {
    this.selectedOption.set(option);
    this.isDropdownOpen.set(false);
    this.announcement.set(`Frequency set to ${option}`);
  }

  protected toggleMenu(): void {
    this.isMenuOpen.update(open => !open);
    this.activeMenuIndex.set(0);
  }

  protected openModal(): void {
    this.lastFocusedElement.set(document.activeElement as HTMLElement);
    this.isModalOpen.set(true);
    this.announcement.set('Dialog opened');
  }

  protected closeModal(): void {
    this.isModalOpen.set(false);
    this.lastFocusedElement()?.focus();
    this.announcement.set('Dialog closed');
  }

  constructor() {
    effect(() => {
      const appRoot = document.querySelector('app-root') as HTMLElement | null;

      if (this.isModalOpen()) {
        appRoot?.setAttribute('inert', '');
        const modal = document.querySelector('.modal') as HTMLElement | null;
        const focusable = modal?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        focusable?.[0]?.focus();
      } else {
        appRoot?.removeAttribute('inert');
      }
    });
  }

  @HostListener('document:keydown', ['$event'])
  protected handleKeydown(event: KeyboardEvent): void {
    /* Modal */
    if (this.isModalOpen()) {
      if (event.key === 'Escape') {
        event.preventDefault();
        this.closeModal();
        return;
      }
    }

    /* Menu */
    if (this.isMenuOpen()) {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        this.activeMenuIndex.update(i =>
          Math.min(i + 1, this.menuItems.length - 1),
        );
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        this.activeMenuIndex.update(i => Math.max(i - 1, 0));
      }

      if (event.key.length === 1) {
        const index = this.menuItems.findIndex(item =>
          item.toLowerCase().startsWith(event.key.toLowerCase()),
        );
        if (index >= 0) {
          this.activeMenuIndex.set(index);
        }
      }
    }

    /* Dropdown */
    if (this.isDropdownOpen()) {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        this.activeOptionIndex.update(i =>
          Math.min(i + 1, this.options.length - 1),
        );
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        this.activeOptionIndex.update(i => Math.max(i - 1, 0));
      }

      if (event.key === 'Enter') {
        event.preventDefault();
        this.selectOption(this.options[this.activeOptionIndex()]);
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        this.isDropdownOpen.set(false);
      }

      if (event.key.length === 1) {
        const index = this.options.findIndex(option =>
          option.toLowerCase().startsWith(event.key.toLowerCase()),
        );
        if (index >= 0) {
          this.activeOptionIndex.set(index);
        }
      }
    }
  }
}
