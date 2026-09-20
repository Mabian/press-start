import { Directive, ElementRef, inject, input, model, output } from '@angular/core';

@Directive({
  selector: '[appArrowSelection]',
  host: {
    '(document:keydown)': 'onKeydown($event)',
  },
})
export class ArrowSelection {
  readonly count = input.required<number>();
  readonly active = input(true);
  readonly selectedIndex = model(0);
  readonly confirmed = output<number>();
  readonly cancelled = output<void>();

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  protected onKeydown(event: KeyboardEvent): void {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) {
      return;
    }
    const group = this.host.nativeElement;
    const target = event.target instanceof Node ? event.target : null;
    const inside = target !== null && group.contains(target);
    const onOption = target instanceof Element && target.closest('[data-arrow-option]') !== null;
    const idle = target === null || target === group.ownerDocument.body;
    if (!inside && !(this.active() && idle)) {
      return;
    }

    const count = this.count();
    const current = this.selectedIndex();
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        this.move((current - 1 + count) % count, inside);
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        this.move((current + 1) % count, inside);
        break;
      case 'Home':
        this.move(0, inside);
        break;
      case 'End':
        this.move(count - 1, inside);
        break;
      case 'Enter':
      case ' ':
        // A focused option fires its own click
        if (onOption) {
          return;
        }
        this.confirmed.emit(current);
        break;
      case 'Escape':
      case 'Backspace':
        this.cancelled.emit();
        break;
      default:
        return;
    }
    event.preventDefault();
  }

  private move(next: number, focusInside: boolean): void {
    this.selectedIndex.set(next);
    if (focusInside) {
      this.host.nativeElement.querySelectorAll<HTMLElement>('[data-arrow-option]')[next]?.focus();
    }
  }
}
