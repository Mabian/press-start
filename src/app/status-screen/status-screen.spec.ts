import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BattleFlow } from '../battle-flow';
import { IMPRINT, PRIVACY } from '../legal-content';
import { StatusScreen } from './status-screen';

describe('StatusScreen', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  const render = async () => {
    const fixture = TestBed.createComponent(StatusScreen);
    await fixture.whenStable();
    return { fixture, host: fixture.nativeElement as HTMLElement };
  };

  it('shows the imprint in english first', async () => {
    const { host } = await render();
    expect(host.querySelector('[role="tab"][aria-selected="true"]')?.textContent?.trim()).toBe(
      IMPRINT.text.en.title,
    );
    expect(host.querySelector('[lang]')?.getAttribute('lang')).toBe('en');
    const lines = Array.from(host.querySelectorAll('address span')).map((s) => s.textContent);
    expect(lines).toEqual([...IMPRINT.address]);
    expect(host.querySelector<HTMLAnchorElement>('a[href^="mailto:"]')?.getAttribute('href')).toBe(
      `mailto:${IMPRINT.email}`,
    );
  });

  it('switches the texts and the lang attribute to german', async () => {
    const { fixture, host } = await render();
    const german = Array.from(host.querySelectorAll<HTMLButtonElement>('.status-screen-language')).find(
      (button) => button.textContent?.trim() === 'DE',
    );
    german?.click();
    await fixture.whenStable();
    expect(host.querySelector('[role="tab"][aria-selected="true"]')?.textContent?.trim()).toBe(
      IMPRINT.text.de.title,
    );
    expect(host.querySelector('[lang]')?.getAttribute('lang')).toBe('de');
    expect(host.textContent).toContain(IMPRINT.text.de.note);
    expect(german?.getAttribute('aria-pressed')).toBe('true');
  });

  it('switches to the privacy policy and back', async () => {
    const { fixture, host } = await render();
    const tabs = () => Array.from(host.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    expect(tabs().map((tab) => tab.textContent?.trim())).toEqual([
      IMPRINT.text.en.title,
      PRIVACY.en.title,
    ]);

    tabs()[1].click();
    await fixture.whenStable();
    expect(tabs()[1].getAttribute('aria-selected')).toBe('true');
    const headings = Array.from(host.querySelectorAll('.status-screen-section-heading')).map(
      (heading) => heading.textContent,
    );
    expect(headings).toEqual(PRIVACY.en.sections.map((section) => section.heading));

    tabs()[0].click();
    await fixture.whenStable();
    expect(host.querySelector('address')).not.toBeNull();
  });

  it('translates the privacy policy as well', async () => {
    const { fixture, host } = await render();
    host.querySelectorAll<HTMLButtonElement>('[role="tab"]')[1].click();
    Array.from(host.querySelectorAll<HTMLButtonElement>('.status-screen-language'))
      .find((button) => button.textContent?.trim() === 'DE')
      ?.click();
    await fixture.whenStable();
    expect(host.querySelector('[role="tab"][aria-selected="true"]')?.textContent?.trim()).toBe(
      PRIVACY.de.title,
    );
    expect(host.textContent).toContain(PRIVACY.de.sections[0].paragraphs[0]);
  });

  const press = async (fixture: ComponentFixture<StatusScreen>, key: string) => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
    await fixture.whenStable();
  };

  it('switches tabs with the left and right arrows', async () => {
    const { fixture, host } = await render();
    await press(fixture, 'ArrowRight');
    expect(host.querySelector('[role="tab"][aria-selected="true"]')?.textContent?.trim()).toBe(
      PRIVACY.en.title,
    );
    await press(fixture, 'ArrowLeft');
    expect(host.querySelector('[role="tab"][aria-selected="true"]')?.textContent?.trim()).toBe(
      IMPRINT.text.en.title,
    );
  });

  it('steps from the panel to the back button and back up', async () => {
    const { fixture, host } = await render();
    const panel = host.querySelector('.status-screen-panel');
    const back = host.querySelector('.status-screen-back');
    await press(fixture, 'ArrowDown');
    expect(document.activeElement).toBe(back);
    await press(fixture, 'ArrowUp');
    expect(document.activeElement).toBe(panel);
  });

  it('keeps the menu quiet while it is open', async () => {
    const flow = TestBed.inject(BattleFlow);
    flow.backToMenu();
    await render();
    expect(flow.mode()).toBe('window');
  });
});
