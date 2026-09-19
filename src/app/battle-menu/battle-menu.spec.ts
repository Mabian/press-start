import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BATTLE_MENU_ITEMS } from '../battle-data';
import { BattleMenu } from './battle-menu';

describe('BattleMenu', () => {
  let fixture: ComponentFixture<BattleMenu>;
  let host: HTMLElement;

  beforeEach(async () => {
    fixture = TestBed.createComponent(BattleMenu);
    fixture.componentRef.setInput('items', BATTLE_MENU_ITEMS);
    host = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  const label = () => host.querySelector('.battle-menu-label')?.textContent?.trim();
  const radios = () => Array.from(host.querySelectorAll<HTMLButtonElement>('[role="radio"]'));
  const checked = () => radios().map((radio) => radio.getAttribute('aria-checked'));
  const press = async (key: string, target: EventTarget = document.body) => {
    target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
    await fixture.whenStable();
  };

  it('starts on the first item', () => {
    expect(label()).toBe('Fight');
    expect(checked()).toEqual(['true', 'false', 'false']);
    expect(radios().map((radio) => radio.tabIndex)).toEqual([0, -1, -1]);
  });

  it('moves right with ArrowRight', async () => {
    await press('ArrowRight');
    expect(label()).toBe('Escape');
    expect(fixture.componentInstance.selectedIndex()).toBe(1);
  });

  it('wraps around with ArrowLeft on the first item', async () => {
    await press('ArrowLeft');
    expect(label()).toBe('Status');
    expect(checked()).toEqual(['false', 'false', 'true']);
  });

  it('moves focus along when the menu has focus', async () => {
    radios()[0].focus();
    await press('ArrowRight', radios()[0]);
    expect(document.activeElement).toBe(radios()[1]);
    expect(radios().map((radio) => radio.tabIndex)).toEqual([-1, 0, -1]);
  });

  it('ignores arrow keys while another control has focus', async () => {
    const input = document.createElement('input');
    document.body.append(input);
    try {
      await press('ArrowRight', input);
      expect(label()).toBe('Fight');
    } finally {
      input.remove();
    }
  });

  it('selects an item on click', async () => {
    radios()[2].click();
    await fixture.whenStable();
    expect(label()).toBe('Status');

    const checked = host.querySelector('[role="radio"][aria-checked="true"]');
    expect(checked?.getAttribute('aria-label')).toBe('Status');
    expect(checked?.querySelector('.battle-menu-cursor')).not.toBeNull();
  });
});
