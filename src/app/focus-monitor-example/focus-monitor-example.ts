import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-focus-monitor-example',
  imports: [],
  templateUrl: './focus-monitor-example.html',
  styleUrl: './focus-monitor-example.css',
})
export class FocusMonitorExample {
  isPanelOpen = signal(false);
  showAdvanced = signal(false);
  statusMessage = signal('');

  openPanel(): void {
    this.isPanelOpen.set(true);
    this.statusMessage.set('Settings panel opened');
  }

  closePanel(): void {
    this.isPanelOpen.set(false);
    this.statusMessage.set('Settings panel closed');
  }

  toggleAdvanced(): void {
    this.showAdvanced.set(!this.showAdvanced);
    this.statusMessage.update(showAdvanced => showAdvanced
      ? 'Advanced settings shown'
      : 'Advanced settings hidden');
  }

  save(): void {
    this.statusMessage.set('Settings saved');
  }
}
