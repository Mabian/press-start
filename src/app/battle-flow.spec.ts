import { TestBed } from '@angular/core/testing';
import { BattleFlow } from './battle-flow';
import { PROJECTS } from './projects';

describe('BattleFlow', () => {
  let flow: BattleFlow;

  beforeEach(() => {
    flow = TestBed.inject(BattleFlow);
    flow.backToMenu();
  });

  it('starts in the menu', () => {
    expect(flow.mode()).toBe('menu');
    expect(flow.logLines()).toEqual([]);
  });

  it('targets the first project when the fight starts', () => {
    flow.selectTarget(2);
    flow.startTargeting();
    expect(flow.mode()).toBe('targeting');
    expect(flow.target()).toBe(PROJECTS[0]);
  });

  it('writes two log lines when attacking', () => {
    flow.attack(PROJECTS[1]);
    expect(flow.mode()).toBe('log');
    expect(flow.logLines()).toEqual([
      `You attack ${PROJECTS[1].name}!`,
      `${PROJECTS[1].name} takes ${PROJECTS[1].damage} damage!`,
    ]);
  });

  it('clears the log when returning to the menu', () => {
    flow.attack(PROJECTS[0]);
    flow.backToMenu();
    expect(flow.mode()).toBe('menu');
    expect(flow.logLines()).toEqual([]);
  });

  it('knows the window and off modes', () => {
    flow.openWindow();
    expect(flow.mode()).toBe('window');
    flow.powerOff();
    expect(flow.mode()).toBe('off');
  });
});
