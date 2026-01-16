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
    this.isDropdownOpen.update(value => !value);
  }

  protected selectOption(option: string): void {
    this.selectedOption.set(option);
    this.isDropdownOpen.set(false);
  }

  protected toggleMenu(): void {
    this.isMenuOpen.update(value => !value);
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
        modal?.focus();
      }
    });
  }

  @HostListener('document:keydown', ['$event'])
  protected handleKeydown(event: KeyboardEvent): void {
    if (this.isModalOpen() && event.key === 'Escape') {
      event.preventDefault();
      this.closeModal();
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
