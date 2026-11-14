import { test } from "../../src/core/fixtures/pages.fixture";
import { Validate } from "../../src/core/validators/validate";
import { HomePage } from "../../src/domain/pages/home.page";

const AMOUNT_OF_ITEMS: number = 8;

test.describe("Home page", () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
  });

  test("loads successfully", async ({ homePage }) => {
    await Validate.haveUrl(homePage.page, HomePage.path);
    await Validate.haveTitle(homePage.page, "Automation Exercise");
  });

  test("shows the complete top menu", async ({ homePage }) => {
    await Validate.visible(homePage.topMenu.container);
    Validate.haveLength(homePage.topMenu.menuLinks, AMOUNT_OF_ITEMS);
    await Validate.visibleAll(homePage.topMenu.menuLinks);
  });
});
