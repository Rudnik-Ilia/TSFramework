import type { Page } from "@playwright/test";

import { TopMenuComponent } from "../components/top-menu.component";

export abstract class BasePage {
  readonly page: Page;
  readonly topMenu: TopMenuComponent;

  constructor(page: Page) {
    this.page = page;
    this.topMenu = new TopMenuComponent(page);
  }

  abstract goto(): Promise<void>;
}
