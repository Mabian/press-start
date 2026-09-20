import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PROJECTS } from '../projects';
import { ProjectDetail } from './project-detail';

describe('ProjectDetail', () => {
  const render = async (id: string) => {
    const fixture = TestBed.createComponent(ProjectDetail);
    fixture.componentRef.setInput('id', id);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  };

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  it('shows the project behind the id', async () => {
    const project = PROJECTS[1];
    const host = await render(project.id);
    expect(host.querySelector('h2')?.textContent?.trim()).toBe(project.name);
    expect(host.textContent).toContain(project.description);
    expect(host.textContent).toContain(project.tech.join(' · '));
    const link = host.querySelector<HTMLAnchorElement>('a.project-detail-action');
    expect(link?.getAttribute('href')).toBe(project.url);
    expect(link?.getAttribute('rel')).toBe('noopener');
  });

  it('moves the selection with the arrow keys', async () => {
    const fixture = TestBed.createComponent(ProjectDetail);
    fixture.componentRef.setInput('id', PROJECTS[0].id);
    await fixture.whenStable();
    const host = fixture.nativeElement as HTMLElement;
    const selected = () =>
      host.querySelector('.project-detail-action-selected')?.textContent?.trim();
    expect(selected()).toBe('Visit');

    document.body.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }),
    );
    await fixture.whenStable();
    expect(selected()).toBe('Back');
  });

  it('stays usable for an unknown id', async () => {
    const host = await render('does-not-exist');
    expect(host.querySelector('h2')?.textContent?.trim()).toBe('Unknown project');
    expect(host.querySelector('button.project-detail-action')).not.toBeNull();
  });
});
