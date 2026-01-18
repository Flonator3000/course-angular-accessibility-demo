import {
  Component,
  ElementRef,
  OnDestroy,
  signal,
  viewChild,
  afterNextRender
} from '@angular/core';
import { FocusMonitor, FocusOrigin } from '@angular/cdk/a11y';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-focus-monitor-example',
  templateUrl: './focus-monitor-example.html',
  styleUrl: './focus-monitor-example.css',
})
export class FocusMonitorExample implements OnDestroy {
  isPanelOpen = signal(false);
  showAdvanced = signal(false);
  statusMessage = signal('');

  private subscriptions = new Subscription();
  private lastFocusOrigin: FocusOrigin | null = null;

  openButton = viewChild<ElementRef<HTMLElement>>('openButton');
  usernameInput = viewChild<ElementRef<HTMLInputElement>>('usernameInput');
  advancedInput = viewChild<ElementRef<HTMLInputElement>>('advancedInput');

  constructor(private focusMonitor: FocusMonitor) {
    afterNextRender(() => {
      const openButtonRef = this.openButton();

      if (!openButtonRef) {
        return;
      }

      this.subscriptions.add(
        this.focusMonitor.monitor(openButtonRef).subscribe(origin => {
          this.lastFocusOrigin = origin;
        })
      );
    });
  }

  openPanel(): void {
    this.isPanelOpen.set(true);
    this.statusMessage.set('Settings panel opened');

    // Defer focus until the view is rendered
    setTimeout(() => {
      if (this.usernameInput) {
        this.focusMonitor.focusVia(
          this.usernameInput()!,
          this.lastFocusOrigin ?? 'program'
        );
      }
    });
  }

  closePanel(): void {
    this.isPanelOpen.set(false);
    this.statusMessage.set('Settings panel closed');

    const buttonRef = this.openButton();
    if (buttonRef) {
      this.focusMonitor.focusVia(
        buttonRef,
        this.lastFocusOrigin ?? 'program'
      );
    }
  }

  toggleAdvanced(): void {
    this.showAdvanced.update(v => !v);
    this.statusMessage.set(
      this.showAdvanced()
        ? 'Advanced settings shown'
        : 'Advanced settings hidden'
    );

    if (this.showAdvanced()) {
      setTimeout(() => {
        if (this.advancedInput) {
          this.focusMonitor.focusVia(
            this.advancedInput()!,
            this.lastFocusOrigin ?? 'program'
          );
        }
      });
    }
  }

  save(): void {
    this.statusMessage.set('Settings saved');
    this.isPanelOpen.set(false);

    const buttonRef = this.openButton();
    if (buttonRef) {
      this.focusMonitor.focusVia(
        buttonRef,
        this.lastFocusOrigin ?? 'program'
      );
    }
  }

  ngOnDestroy(): void {
    const buttonRef = this.openButton();
    if (buttonRef) {
      this.focusMonitor.stopMonitoring(buttonRef);
    }

    this.subscriptions.unsubscribe();
  }
}
