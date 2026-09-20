import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';

const LINE_DELAY = 700;
const FINISH_DELAY = 900;

@Component({
  selector: 'app-battle-log',
  templateUrl: './battle-log.html',
  styleUrl: './battle-log.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown)': 'onKeydown($event)',
    '(click)': 'skip()',
  },
})
export class BattleLog implements OnInit {
  readonly lines = input.required<readonly string[]>();
  readonly finished = output<void>();

  private readonly document = inject(DOCUMENT);
  private readonly timers: ReturnType<typeof setTimeout>[] = [];
  private readonly shown = signal(0);

  protected readonly visibleLines = computed(() => this.lines().slice(0, this.shown()));

  constructor() {
    inject(DestroyRef).onDestroy(() => this.clearTimers());
  }

  ngOnInit(): void {
    if (this.prefersReducedMotion()) {
      this.shown.set(this.lines().length);
      this.after(FINISH_DELAY, () => this.finished.emit());
      return;
    }
    this.lines().forEach((_, index) => {
      this.after(LINE_DELAY * index, () => this.shown.set(index + 1));
    });
    this.after(LINE_DELAY * this.lines().length + FINISH_DELAY, () => this.finished.emit());
  }

  protected skip(): void {
    if (this.shown() < this.lines().length) {
      this.clearTimers();
      this.shown.set(this.lines().length);
      this.after(FINISH_DELAY, () => this.finished.emit());
      return;
    }
    this.clearTimers();
    this.finished.emit();
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }
    event.preventDefault();
    this.skip();
  }

  private after(delay: number, run: () => void): void {
    this.timers.push(setTimeout(run, delay));
  }

  private clearTimers(): void {
    this.timers.forEach(clearTimeout);
    this.timers.length = 0;
  }

  private prefersReducedMotion(): boolean {
    const view = this.document.defaultView;
    if (typeof view?.matchMedia !== 'function') {
      return false;
    }
    return view.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
}
