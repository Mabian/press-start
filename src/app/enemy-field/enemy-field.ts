import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';
import { ArrowSelection } from '../arrow-selection';
import { Project } from '../projects';

@Component({
  selector: 'app-enemy-field',
  imports: [NgOptimizedImage, ArrowSelection],
  templateUrl: './enemy-field.html',
  styleUrl: './enemy-field.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnemyField {
  readonly projects = input.required<readonly Project[]>();
  readonly active = input(false);
  readonly selectedIndex = model(0);
  readonly chosen = output<Project>();
  readonly cancelled = output<void>();

  protected choose(index: number): void {
    this.selectedIndex.set(index);
    this.chosen.emit(this.projects()[index]);
  }
}
