import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  signal
} from '@angular/core';
import { FocusMonitor, FocusOrigin } from '@angular/cdk/a11y';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-focus-monitor-example',
  templateUrl: './focus-monitor-example.html',
  styleUrl: './focus-monitor-example.css',
})
export class FocusMonitorExample implements AfterViewInit, OnDestroy {
  isPanelOpen = signal(false);
  showAdvanced = signal(false);
  statusMessage = signal('');

  private subscriptions = new Subscription();
  private lastFocusOrigin: FocusOrigin | null = null;

  @ViewChild('openButton', { static: true })
  openButton!: ElementRef<HTMLElement>;

  @ViewChild('usernameInput')
  usernameInput?: ElementRef<HTMLInputElement>;

  @ViewChild('advancedInput')
  advancedInput?: ElementRef<HTMLInputElement>;

  constructor(private focusMonitor: FocusMonitor) {}

  ngAfterViewInit(): void {
    this.subscriptions.add(
      this.focusMonitor.monitor(this.openButton).subscribe(origin => {
        this.lastFocusOrigin = origin;
      })
    );
  }

  openPanel(): void {
    this.isPanelOpen.set(true);
    this.statusMessage.set('Settings panel opened');

    // Defer focus until the view is rendered
    setTimeout(() => {
      if (this.usernameInput) {
        this.focusMonitor.focusVia(
          this.usernameInput,
          this.lastFocusOrigin ?? 'program'
        );
      }
    });
  }

  closePanel(): void {
    this.isPanelOpen.set(false);
    this.statusMessage.set('Settings panel closed');

    // Restore focus to trigger element
    this.focusMonitor.focusVia(
      this.openButton,
      this.lastFocusOrigin ?? 'program'
    );
  }

  toggleAdvanced(): void {
    this.showAdvanced.set(!this.showAdvanced);
    this.statusMessage.update(showAdvanced => showAdvanced
      ? 'Advanced settings shown'
      : 'Advanced settings hidden');

    if (this.showAdvanced()) {
      setTimeout(() => {
        if (this.advancedInput) {
          this.focusMonitor.focusVia(
            this.advancedInput,
            this.lastFocusOrigin ?? 'program'
          );
        }
      });
    }
  }

  save(): void {
    this.statusMessage.set('Settings saved');

    this.focusMonitor.focusVia(
      this.openButton,
      this.lastFocusOrigin ?? 'program'
    );

    this.isPanelOpen.set(false);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.focusMonitor.stopMonitoring(this.openButton);
  }
}
