import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Boot } from './boot';

// sweep start + 10 letter gaps + sweep
const SEQUENCE_MS = 3750;

describe('Boot', () => {
  let fixture: ComponentFixture<Boot>;
  let finished: number;

  const host = () => fixture.nativeElement as HTMLElement;
  const letters = () =>
    Array.from(host().querySelectorAll('.boot-letter')).map((span) => span.textContent);
  const press = () => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

  const create = () => {
    fixture = TestBed.createComponent(Boot);
    fixture.componentRef.setInput('heading', 'PRESS START');
    fixture.componentRef.setInput('subtitle', 'Portfolio');
    finished = 0;
    fixture.componentInstance.finished.subscribe(() => finished++);
    fixture.detectChanges();
  };

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('draws one letter per character and the subtitle', () => {
    create();
    expect(letters()).toEqual([...'PRESS START']);
    expect(host().querySelector('.boot-subtitle')?.textContent).toBe('Portfolio');
    expect(host().querySelector('.sr-only')?.textContent).toBe('PRESS START');
  });

  it('waits for a key once the sequence is over', () => {
    create();
    expect(host().classList).not.toContain('boot-ready');

    vi.advanceTimersByTime(SEQUENCE_MS);
    fixture.detectChanges();
    expect(host().classList).toContain('boot-ready');
    expect(finished).toBe(0);

    press();
    fixture.detectChanges();
    expect(host().classList).toContain('boot-leaving');
    expect(finished).toBe(0);

    vi.advanceTimersByTime(400);
    expect(finished).toBe(1);
  });

  it('skips to the end on the first key and starts on the second', () => {
    create();
    press();
    fixture.detectChanges();
    expect(host().classList).toContain('boot-ready');
    expect(finished).toBe(0);

    vi.advanceTimersByTime(SEQUENCE_MS);
    expect(finished).toBe(0);

    press();
    vi.advanceTimersByTime(400);
    expect(finished).toBe(1);
  });

  it('is ready right away when motion is reduced', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: true }) as MediaQueryList);
    create();
    expect(host().classList).toContain('boot-ready');
  });
});
