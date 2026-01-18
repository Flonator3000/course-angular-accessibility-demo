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

  protected isDropdownOpen: WritableSignal<boolean> = signal(false);
  protected selectedOption: WritableSignal<string | null> = signal(null);
  protected readonly options = ['Daily', 'Weekly', 'Monthly'];
  protected activeOptionIndex: WritableSignal<number> = signal(0);

  protected isMenuOpen: WritableSignal<boolean> = signal(false);
  protected activeMenuIndex: WritableSignal<number> = signal(0);

  protected isModalOpen: WritableSignal<boolean> = signal(false);
  protected lastFocusedElement: WritableSignal<HTMLElement | null> = signal(null);

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
    }
  }

  protected toggleNotifications(): void {
    this.notificationsEnabled.update(value => !value);
  }

  protected toggleDropdown(): void {
    this.isDropdownOpen.update(open => !open);
    this.activeOptionIndex.set(0);
  }

  protected selectOption(option: string): void {
    this.selectedOption.set(option);
    this.isDropdownOpen.set(false);
  }

  protected toggleMenu(): void {
    this.isMenuOpen.update(value => !value);
    this.activeMenuIndex.set(0);
  }

  protected openModal(): void {
    this.lastFocusedElement.set(document.activeElement as HTMLElement);
    this.isModalOpen.set(true);
  }

  protected closeModal(): void {
    this.isModalOpen.set(false);
    this.lastFocusedElement()?.focus();
  }

  constructor() {
    effect(() => {
      if (this.isModalOpen()) {
        const modal = document.querySelector('.modal') as HTMLElement | null;
        const focusable = modal?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        focusable?.[0]?.focus();
      }
    });
  }

  @HostListener('document:keydown', ['$event'])
  protected handleKeydown(event: KeyboardEvent): void {
    if (this.isModalOpen()) {
      if (event.key === 'Escape') {
        event.preventDefault();
        this.closeModal();
        return;
      }

      if (event.key === 'Tab') {
        const modal = document.querySelector('.modal') as HTMLElement | null;
        const focusable = modal?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );

        if (!focusable || focusable.length === 0) {
          return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }

      return;
    }

    if (this.isMenuOpen()) {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        this.activeMenuIndex.update(i => Math.min(i + 1, 2));
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        this.activeMenuIndex.update(i => Math.max(i - 1, 0));
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        this.isMenuOpen.set(false);
      }
    }

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
        const option = this.options[this.activeOptionIndex()];
        this.selectOption(option);
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        this.isDropdownOpen.set(false);
      }
    }
  }
}
