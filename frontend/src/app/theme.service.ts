import {Injectable, Renderer2, RendererFactory2} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private renderer: Renderer2;
  private colorTheme: string = "light-mode";

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  initTheme() {
    this.getColorTheme();
    this.renderer.addClass(document.body, this.colorTheme);
  }

  update(theme: 'dark-mode' | 'light-mode') {
    this.setColorTheme(theme);
    const previousColorTheme = (theme === 'dark-mode' ? 'light-mode' : 'dark-mode');
    this.renderer.removeClass(document.body, previousColorTheme);
    this.renderer.addClass(document.body, theme);
  }

  isDarkMode() {
    return this.colorTheme === 'dark-mode';
  }

  private setColorTheme(theme: string) {
    this.colorTheme = theme;
    localStorage.setItem('userDefinedTheme', theme);
  }

  private getColorTheme() {
    if (localStorage.hasOwnProperty('userDefinedTheme')) {
      this.colorTheme = (<string>localStorage.getItem('userDefinedTheme'));
    } else {
      this.colorTheme = 'dark-mode';
      localStorage.setItem('userDefinedTheme', 'dark-mode');
    }
  }
}
