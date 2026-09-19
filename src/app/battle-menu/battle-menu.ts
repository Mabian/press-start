import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  input,
  model,
  viewChildren,
} from '@angular/core';
import { BattleMenuItem } from '../battle-data';

@Component({
  selector: 'app-battle-menu',
  imports: [NgOptimizedImage],
  templateUrl: './battle-menu.html',
  styleUrl: './battle-menu.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown)': 'onKeydown($event)',
  },
})
export class BattleMenu {
  readonly items = input.required<readonly BattleMenuItem[]>();
  readonly selectedIndex = model(0);

  protected readonly selectedItem = computed(() => this.items()[this.selectedIndex()]);

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly options = viewChildren<ElementRef<HTMLButtonElement>>('option');

  protected select(index: number): void {
    this.selectedIndex.set(index);
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) {
      return;
    }
    const host = this.host.nativeElement;
    const target = event.target instanceof Node ? event.target : null;
    const focusInMenu = target !== null && host.contains(target);
    const focusIdle = target === null || target === host.ownerDocument.body;
    if (!focusInMenu && !focusIdle) {
      return;
    }

    const count = this.items().length;
    const current = this.selectedIndex();
    let next: number;
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        next = (current - 1 + count) % count;
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        next = (current + 1) % count;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = count - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    this.select(next);
    if (focusInMenu) {
      this.options()[next]?.nativeElement.focus();
    }
  }
}
