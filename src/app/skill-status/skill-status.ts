import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Skill } from '../battle-data';

const BAR_WIDTH_MAX_PIXEL_LENGTH = 40;

@Component({
  selector: 'app-skill-status',
  templateUrl: './skill-status.html',
  styleUrl: './skill-status.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillStatus {
  readonly skills = input.required<readonly Skill[]>();

  protected readonly columns = computed(() =>
    this.skills().map((skill) => ({
      name: skill.name,
      stats: [
        {
          label: 'LV',
          description: 'Level',
          value: skill.level,
          max: skill.maxLevel,
          bar: barWidth(skill.level, skill.maxLevel),
        },
        {
          label: 'EP',
          description: 'Experience',
          value: skill.experience,
          max: skill.maxExperience,
          bar: barWidth(skill.experience, skill.maxExperience),
        },
      ],
    })),
  );
}

function barWidth(value: number, max: number): number {
  return max > 0
    ? Math.round((BAR_WIDTH_MAX_PIXEL_LENGTH * Math.min(Math.max(value, 0), max)) / max)
    : 0;
}
