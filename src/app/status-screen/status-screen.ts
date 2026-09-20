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
    '(document:keydown.escape)': 'close()',
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
}
