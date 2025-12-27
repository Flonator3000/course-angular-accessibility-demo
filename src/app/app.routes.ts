import { Routes } from '@angular/router';
import { AccessibleDemoComponent } from './accessible-demo/accessible-demo';

export const routes: Routes = [
    {path: '', component: AccessibleDemoComponent},
{path: 'a', component: AccessibleDemoComponent},
    {path: '**', component: AccessibleDemoComponent},
];
