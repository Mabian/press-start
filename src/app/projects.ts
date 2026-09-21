export interface Project {
  readonly id: string;
  readonly name: string;
  readonly tagline: string;
  readonly description: string;
  readonly tech: readonly string[];
  readonly url: string;
  readonly sprite: string;
  readonly damage: number;
}

export const PROJECTS: readonly Project[] = [
  {
    id: 'mindsync',
    name: 'Mindsync',
    tagline: 'Co-op party game',
    description:
      'Everyone answers the same open question each round. Agree with all the others and the round is a full match. Rooms run live over a WebSocket.',
    tech: ['Vue 3', 'Spring Boot', 'WebSocket'],
    url: 'https://mindsync.fun',
    sprite: 'enemies/brain.svg',
    damage: 12,
  },
  {
    id: 'shiritorii',
    name: 'Shiritorii',
    tagline: 'Japanese word chain',
    description:
      'Chain words by the kana they end on. Romaji turns into kana as you type. Dictionary, rules and opponent all run in the browser.',
    tech: ['Angular', 'TypeScript', 'GitHub Pages'],
    url: 'https://mabian.github.io/shiritorii/',
    sprite: 'enemies/torii.svg',
    damage: 14,
  },
  {
    id: 'press-start',
    name: 'Press Start',
    tagline: 'The page you are on',
    description:
      'A portfolio inspired by a Game Boy Advance battle screen. Menu, windows and the pulsing cursor are built in CSS.',
    tech: ['Angular', 'SCSS', 'GitHub Pages'],
    url: 'https://mabian.github.io/press-start/',
    sprite: 'enemies/handheld.svg',
    damage: 10,
  },
];
