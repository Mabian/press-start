import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  output,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'app-power-off',
  templateUrl: './power-off.html',
  styleUrl: './power-off.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown)': 'onKeydown($event)',
  },
})
export class PowerOff implements AfterViewInit {
  readonly poweredOn = output<void>();

  private readonly button = viewChild.required<ElementRef<HTMLButtonElement>>('button');

  ngAfterViewInit(): void {
    this.button().nativeElement.focus();
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.altKey || event.ctrlKey || event.metaKey || event.key === 'Tab') {
      return;
    }
    event.preventDefault();
    this.poweredOn.emit();
  }
}
