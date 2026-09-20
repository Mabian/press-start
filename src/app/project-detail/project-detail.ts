import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  input,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { Router } from '@angular/router';
import { ArrowSelection } from '../arrow-selection';
import { BattleFlow } from '../battle-flow';
import { PROJECTS } from '../projects';

@Component({
  selector: 'app-project-detail',
  imports: [ArrowSelection],
  templateUrl: './project-detail.html',
  styleUrl: './project-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDetail implements AfterViewInit {
  readonly id = input.required<string>();

  protected readonly project = computed(() => PROJECTS.find((entry) => entry.id === this.id()));
  protected readonly actionIndex = signal(0);

  private readonly window = viewChild.required<ElementRef<HTMLElement>>('window');
  private readonly actions = viewChildren<ElementRef<HTMLElement>>('action');
  private readonly router = inject(Router);
  private readonly flow = inject(BattleFlow);

  constructor() {
    this.flow.openWindow();
  }

  ngAfterViewInit(): void {
    this.window().nativeElement.focus();
  }

  protected activate(index: number): void {
    this.actions()[index]?.nativeElement.click();
  }

  protected close(): void {
    this.flow.backToMenu();
    void this.router.navigate(['/']);
  }
}
