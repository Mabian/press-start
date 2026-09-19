export interface BattleMenuItem {
  readonly id: string;
  readonly label: string;
  readonly icon: string;
}

export const BATTLE_MENU_ITEMS: readonly BattleMenuItem[] = [
  { id: 'fight', label: 'Fight', icon: 'fight.png' },
  { id: 'escape', label: 'Escape', icon: 'escape.png' },
  { id: 'status', label: 'Status', icon: 'status.png' },
];
