import { Injectable, computed, signal } from '@angular/core';
import { PROJECTS, Project } from './projects';

export type BattleMode = 'menu' | 'targeting' | 'log' | 'window' | 'off';

@Injectable({ providedIn: 'root' })
export class BattleFlow {
  private readonly modeState = signal<BattleMode>('menu');
  private readonly targetIndexState = signal(0);
  private readonly logLinesState = signal<readonly string[]>([]);

  readonly mode = this.modeState.asReadonly();
  readonly targetIndex = this.targetIndexState.asReadonly();
  readonly logLines = this.logLinesState.asReadonly();
  readonly target = computed(() => PROJECTS[this.targetIndexState()]);

  startTargeting(): void {
    this.targetIndexState.set(0);
    this.modeState.set('targeting');
  }

  selectTarget(index: number): void {
    this.targetIndexState.set(index);
  }

  attack(project: Project): void {
    this.logLinesState.set([`You attack ${project.name}!`, `${project.name} takes ${project.damage} damage!`]);
    this.modeState.set('log');
  }

  openWindow(): void {
    this.modeState.set('window');
  }

  powerOff(): void {
    this.modeState.set('off');
  }

  backToMenu(): void {
    this.logLinesState.set([]);
    this.modeState.set('menu');
  }
}
