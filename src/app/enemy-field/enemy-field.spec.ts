import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PROJECTS, Project } from '../projects';
import { EnemyField } from './enemy-field';

describe('EnemyField', () => {
  let fixture: ComponentFixture<EnemyField>;
  let host: HTMLElement;
  let chosen: Project[];
  let cancelled: number;

  beforeEach(async () => {
    fixture = TestBed.createComponent(EnemyField);
    fixture.componentRef.setInput('projects', PROJECTS);
    fixture.componentRef.setInput('active', true);
    host = fixture.nativeElement as HTMLElement;
    chosen = [];
    cancelled = 0;
    fixture.componentInstance.chosen.subscribe((project) => chosen.push(project));
    fixture.componentInstance.cancelled.subscribe(() => cancelled++);
    await fixture.whenStable();
  });

  const enemies = () => Array.from(host.querySelectorAll<HTMLButtonElement>('[role="radio"]'));
  const press = async (key: string, target: EventTarget = document.body) => {
    target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
    await fixture.whenStable();
  };

  it('shows one enemy per project', () => {
    expect(enemies().map((enemy) => enemy.getAttribute('aria-label'))).toEqual(
      PROJECTS.map((project) => project.name),
    );
  });

  it('moves the target with the arrow keys and wraps around', async () => {
    await press('ArrowRight');
    expect(fixture.componentInstance.selectedIndex()).toBe(1);
    await press('ArrowLeft');
    await press('ArrowLeft');
    expect(fixture.componentInstance.selectedIndex()).toBe(PROJECTS.length - 1);
  });

  it('marks only the targeted enemy while active', async () => {
    await press('ArrowRight');
    const targeted = host.querySelectorAll('.enemy-field-enemy-targeted');
    expect(targeted.length).toBe(1);
    expect(targeted[0].getAttribute('aria-label')).toBe(PROJECTS[1].name);
  });

  it('chooses the target on enter and on click', async () => {
    await press('Enter');
    expect(chosen).toEqual([PROJECTS[0]]);
    enemies()[2].click();
    await fixture.whenStable();
    expect(chosen[1]).toBe(PROJECTS[2]);
  });

  it('cancels on escape', async () => {
    await press('Escape');
    expect(cancelled).toBe(1);
  });

  it('ignores keys while inactive', async () => {
    fixture.componentRef.setInput('active', false);
    await fixture.whenStable();
    await press('ArrowRight');
    expect(fixture.componentInstance.selectedIndex()).toBe(0);
  });
});
