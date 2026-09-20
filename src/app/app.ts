import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { BATTLE_MENU_ITEMS, SKILLS } from './battle-data';
import { BattleFlow } from './battle-flow';
import { BattleLog } from './battle-log/battle-log';
import { BattleMenu } from './battle-menu/battle-menu';
import { EnemyField } from './enemy-field/enemy-field';
import { PowerOff } from './power-off/power-off';
import { PROJECTS, Project } from './projects';
import { SkillStatus } from './skill-status/skill-status';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BattleLog, BattleMenu, EnemyField, PowerOff, SkillStatus],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly menuItems = BATTLE_MENU_ITEMS;
  protected readonly skills = SKILLS;
  protected readonly projects = PROJECTS;
  protected readonly selectedIndex = signal(0);
  protected readonly flow = inject(BattleFlow);

  private readonly router = inject(Router);

  protected confirmMenu(): void {
    switch (this.menuItems[this.selectedIndex()].id) {
      case 'fight':
        this.flow.startTargeting();
        break;
      case 'status':
        void this.router.navigate(['/status']);
        break;
      case 'escape':
        this.flow.powerOff();
        break;
    }
  }

  protected attack(project: Project): void {
    this.flow.attack(project);
  }

  protected openTarget(): void {
    void this.router.navigate(['/projects', this.flow.target().id]);
  }
}
