import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { BattleFlow } from './battle-flow';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
    // Root singleton, starts in the boot sequence
    TestBed.inject(BattleFlow).backToMenu();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the skill status and the battle menu', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-skill-status')?.textContent).toContain('Angular');
    expect(compiled.querySelector('app-battle-menu .battle-menu-label')?.textContent?.trim()).toBe(
      'Fight',
    );
  });
});
