import { TestBed } from '@angular/core/testing';
import { Skill } from '../battle-data';
import { SkillStatus } from './skill-status';

describe('SkillStatus', () => {
  const skills: Skill[] = [
    { name: 'Angular', level: 30, maxLevel: 30, experience: 12, maxExperience: 16 },
    { name: 'Vue', level: 15, maxLevel: 30, experience: 0, maxExperience: 16 },
  ];

  const render = async () => {
    const fixture = TestBed.createComponent(SkillStatus);
    fixture.componentRef.setInput('skills', skills);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  };

  it('renders one column per skill with level and experience', async () => {
    const host = await render();
    const names = Array.from(host.querySelectorAll('h2')).map((h) => h.textContent?.trim());
    expect(names).toEqual(['Angular', 'Vue']);

    const labels = Array.from(host.querySelectorAll('dt')).map((dt) => ({
      visible: dt.querySelector('[aria-hidden="true"]')?.textContent,
      spoken: dt.querySelector('.sr-only')?.textContent,
    }));
    expect(labels).toEqual([
      { visible: 'LV', spoken: 'Level' },
      { visible: 'EP', spoken: 'Experience' },
      { visible: 'LV', spoken: 'Level' },
      { visible: 'EP', spoken: 'Experience' },
    ]);
    const values = Array.from(host.querySelectorAll('dd')).map((dd) =>
      dd.textContent?.replace(/\s+/g, ' ').trim(),
    );
    expect(values).toEqual(['30 of 30', '12 of 16', '15 of 30', '0 of 16']);
  });

  it('scales the bars to the value', async () => {
    const host = await render();
    const bars = Array.from(host.querySelectorAll<HTMLElement>('.skill-status-bar')).map((bar) =>
      bar.style.getPropertyValue('--bar'),
    );
    expect(bars).toEqual(['40', '30', '20', '0']);
  });
});
