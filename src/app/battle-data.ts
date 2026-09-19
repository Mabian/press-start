export interface BattleMenuItem {
  readonly id: string;
  readonly label: string;
  readonly icon: string;
}

export interface Skill {
  readonly name: string;
  readonly level: number;
  readonly maxLevel: number;
  readonly experience: number;
  readonly maxExperience: number;
}

export const BATTLE_MENU_ITEMS: readonly BattleMenuItem[] = [
  { id: 'fight', label: 'Fight', icon: 'fight.png' },
  { id: 'escape', label: 'Escape', icon: 'escape.png' },
  { id: 'status', label: 'Status', icon: 'status.png' },
];

export const SKILLS: readonly Skill[] = [
  { name: 'Angular', level: 26, maxLevel: 30, experience: 12, maxExperience: 16 },
  { name: 'Vue.js', level: 18, maxLevel: 30, experience: 6, maxExperience: 16 },
  { name: 'Java', level: 26, maxLevel: 30, experience: 10, maxExperience: 16 },
  { name: 'DevOps', level: 24, maxLevel: 30, experience: 5, maxExperience: 16 },
];
