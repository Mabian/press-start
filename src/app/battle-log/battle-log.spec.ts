import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BattleLog } from './battle-log';

describe('BattleLog', () => {
  let fixture: ComponentFixture<BattleLog>;
  let finished: number;

  const lines = () =>
    Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('span')).map((span) =>
      span.textContent?.trim(),
    );

  beforeEach(() => {
    vi.useFakeTimers();
    fixture = TestBed.createComponent(BattleLog);
    fixture.componentRef.setInput('lines', ['first line', 'second line']);
    finished = 0;
    fixture.componentInstance.finished.subscribe(() => finished++);
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('reveals the lines one after another', () => {
    vi.advanceTimersByTime(0);
    fixture.detectChanges();
    expect(lines()).toEqual(['first line']);

    vi.advanceTimersByTime(700);
    fixture.detectChanges();
    expect(lines()).toEqual(['first line', 'second line']);
    expect(finished).toBe(0);
  });

  it('reports the end after the last line', () => {
    vi.advanceTimersByTime(700 * 2 + 900);
    fixture.detectChanges();
    expect(finished).toBe(1);
  });

  it('shows everything at once when skipped', () => {
    fixture.nativeElement.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();
    expect(lines()).toEqual(['first line', 'second line']);
    expect(finished).toBe(0);

    vi.advanceTimersByTime(900);
    fixture.detectChanges();
    expect(finished).toBe(1);
  });
});
