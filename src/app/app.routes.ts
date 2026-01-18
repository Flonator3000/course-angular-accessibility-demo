import { Routes } from '@angular/router';
import { AccessibleDemoComponent } from './accessible-demo/accessible-demo';
import { FormDemo } from './form-demo/form-demo';
import { FocusMonitorExample } from './focus-monitor-example/focus-monitor-example';

export const routes: Routes = [
    { path: '', component: AccessibleDemoComponent },
    { path: 'a', component: AccessibleDemoComponent },
    { path: 'form-demo', component: FormDemo },
    { path: 'focus-monitor', component: FocusMonitorExample },
    { path: '**', component: AccessibleDemoComponent },
];
