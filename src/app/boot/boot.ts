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
import { prefersReducedMotion } from '../reduced-motion';

const SWEEP_START = 1850;
const SWEEP_STEP = 50;
const SWEEP_MS = 1400;
const EXIT_MS = 400;

type BootPhase = 'running' | 'ready' | 'leaving';

@Component({
  selector: 'app-boot',
  templateUrl: './boot.html',
  styleUrl: './boot.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown)': 'onKeydown($event)',
    '[class.boot-ready]': 'phase() !== "running"',
    '[class.boot-leaving]': 'phase() === "leaving"',
  },
})
export class Boot implements OnInit {
  readonly heading = input.required<string>();
  readonly subtitle = input.required<string>();
  readonly finished = output<void>();

  protected readonly letters = computed(() => [...this.heading()]);
  protected readonly phase = signal<BootPhase>('running');

  private readonly document = inject(DOCUMENT);
  private readonly timers: ReturnType<typeof setTimeout>[] = [];

  constructor() {
    inject(DestroyRef).onDestroy(() => this.clearTimers());
  }

  ngOnInit(): void {
    if (prefersReducedMotion(this.document)) {
      this.phase.set('ready');
      return;
    }
    const lastLetter = this.letters().length - 1;
    this.after(SWEEP_START + lastLetter * SWEEP_STEP + SWEEP_MS, () => this.phase.set('ready'));
  }

  protected start(): void {
    if (this.phase() === 'leaving') {
      return;
    }
    this.clearTimers();
    if (this.phase() === 'running') {
      this.phase.set('ready');
      return;
    }
    this.phase.set('leaving');
    this.after(EXIT_MS, () => this.finished.emit());
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.altKey || event.ctrlKey || event.metaKey || event.key === 'Tab') {
      return;
    }
    // Swallows the click the focused button fires for Enter and Space
    event.preventDefault();
    this.start();
  }

  private after(delay: number, run: () => void): void {
    this.timers.push(setTimeout(run, delay));
  }

  private clearTimers(): void {
    this.timers.forEach(clearTimeout);
    this.timers.length = 0;
  }
}
