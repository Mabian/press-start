import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, model, output } from '@angular/core';
import { ArrowSelection } from '../arrow-selection';
import { BattleMenuItem } from '../battle-data';

@Component({
  selector: 'app-battle-menu',
  imports: [NgOptimizedImage, ArrowSelection],
  templateUrl: './battle-menu.html',
  styleUrl: './battle-menu.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BattleMenu {
  readonly items = input.required<readonly BattleMenuItem[]>();
  readonly active = input(true);
  readonly selectedIndex = model(0);
  readonly confirmed = output<BattleMenuItem>();

  protected readonly selectedItem = computed(() => this.items()[this.selectedIndex()]);

  protected confirm(index: number): void {
    this.selectedIndex.set(index);
    this.confirmed.emit(this.items()[index]);
  }
}
