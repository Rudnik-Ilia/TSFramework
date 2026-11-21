import { expect, test } from "../../infra/core/fixtures/pages.fixture";
import { signupData } from "./test_data/signup.data";

test.describe("Signup", () => {
  test("fills all account fields without creating an account", async ({ signupPage }) => {
    await signupPage.goto();
    await expect(signupPage.heading).toBeVisible();

    await signupPage.fillAccountDetails(
      signupData.email,
      signupData.password,
      signupData.nickname,
    );
    await signupPage.selectCountry(signupData.countryCode);
    await signupPage.selectState(signupData.stateCode);

    await expect(signupPage.emailInput).toHaveValue(signupData.email);
    await expect(signupPage.passwordInput).toHaveValue(signupData.password);
    await expect(signupPage.nicknameInput).toHaveValue(signupData.nickname);
    await expect(signupPage.countryDropdown).toContainText(signupData.countryName);
    await expect(signupPage.stateDropdown).toContainText(signupData.stateName);
    await expect(signupPage.createAccountButton).toBeEnabled();
  });
});
