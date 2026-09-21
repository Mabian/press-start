import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { ArrowSelection } from '../arrow-selection';
import { BattleFlow } from '../battle-flow';
import { IMPRINT, LANGUAGES, Language, PRIVACY } from '../legal-content';

@Component({
  selector: 'app-status-screen',
  imports: [ArrowSelection],
  templateUrl: './status-screen.html',
  styleUrl: './status-screen.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown)': 'onKeydown($event)',
  },
})
export class StatusScreen implements AfterViewInit {
  protected readonly imprint = IMPRINT;
  protected readonly languages = LANGUAGES;
  protected readonly language = signal<Language>('en');
  protected readonly tabIndex = signal(0);

  protected readonly text = computed(() => IMPRINT.text[this.language()]);
  protected readonly privacy = computed(() => PRIVACY[this.language()]);
  protected readonly tabs = computed(() => [this.text().title, this.privacy().title]);

  private readonly panel = viewChild.required<ElementRef<HTMLElement>>('panel');
  private readonly tablist = viewChild.required<ElementRef<HTMLElement>>('tablist');
  private readonly back = viewChild.required<ElementRef<HTMLButtonElement>>('back');
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly flow = inject(BattleFlow);

  constructor() {
    this.flow.openWindow();
  }

  ngAfterViewInit(): void {
    this.panel().nativeElement.focus();
  }

  protected close(): void {
    this.flow.backToMenu();
    void this.router.navigate(['/']);
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) {
      return;
    }
    switch (event.key) {
      case 'Escape':
        this.close();
        break;
      case 'ArrowLeft':
        this.switchTab(-1, event);
        break;
      case 'ArrowRight':
        this.switchTab(1, event);
        break;
      case 'ArrowDown':
        this.moveDown(event);
        break;
      case 'ArrowUp':
        this.moveUp(event);
        break;
    }
  }

  private switchTab(step: number, event: KeyboardEvent): void {
    if (this.onTablist(event)) {
      return;
    }
    event.preventDefault();
    const count = this.tabs().length;
    this.tabIndex.update((index) => (index + step + count) % count);
  }

  private moveDown(event: KeyboardEvent): void {
    if (this.onTablist(event)) {
      return;
    }
    const panel = this.panel().nativeElement;
    const atEnd = panel.scrollTop + panel.clientHeight >= panel.scrollHeight - 1;
    // Read to the end first, then step on to the button
    if (this.document.activeElement === panel && !atEnd) {
      return;
    }
    event.preventDefault();
    this.back().nativeElement.focus();
  }

  private moveUp(event: KeyboardEvent): void {
    if (this.onTablist(event) || this.document.activeElement !== this.back().nativeElement) {
      return;
    }
    event.preventDefault();
    this.panel().nativeElement.focus();
  }

  private onTablist(event: KeyboardEvent): boolean {
    const target = event.target;
    return target instanceof Node && this.tablist().nativeElement.contains(target);
  }
}
