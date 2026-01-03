import { describe, it, expect } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { AccessibleDemoComponent } from './accessible-demo'

import axe, { AxeResults } from 'axe-core';

describe('ExampleComponent accessibility', () => {
  it('should have no detectable accessibility violations', async () => {
    await TestBed.configureTestingModule({
      declarations: [],
    }).compileComponents();

    const fixture = TestBed.createComponent(AccessibleDemoComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;

    const results: AxeResults = await axe.run(element);


    console.log(
      results.violations.map(v => ({
        id: v.id,
        description: v.description,
        nodes: v.nodes.map(n => n.html),
      }))
    );

    expect(results.violations).toHaveLength(0);
  });
});