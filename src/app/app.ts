import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BATTLE_MENU_ITEMS, SKILLS } from './battle-data';
import { BattleMenu } from './battle-menu/battle-menu';
import { SkillStatus } from './skill-status/skill-status';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BattleMenu, SkillStatus],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly menuItems = BATTLE_MENU_ITEMS;
  protected readonly skills = SKILLS;
  protected readonly selectedIndex = signal(0);
}
