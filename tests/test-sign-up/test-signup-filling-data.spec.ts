import { test } from "../../infra/core/fixtures/email.fixture";
import { Markers, TestTags } from "../../infra/utils/markers.util";
import { Validate } from "../../infra/core/validations/validate.validation";
import formDataAll from "./test-data/form-for-all.data.json";
import formDataUS from "./test-data/form-for-us.data.json";

test.describe("Positive signup scenarios with valid data and no account creation.Strong password.", () => {
  for (const setData of formDataAll) {
    test(`Create Account can be clicked after selecting ${setData.countryName}`, Markers(TestTags.REGRESSION), async ({ signupPage }) => {
      await signupPage.goto();

      await Validate.visibleAll([
        signupPage.heading,
        signupPage.emailInput,
        signupPage.passwordInput,
        signupPage.nicknameInput,
        signupPage.countryDropdown,
        signupPage.createAccountButton,
      ]);
      await signupPage.fillAccountDetails(setData.email, setData.password, setData.nickname);
      await signupPage.selectCountry(setData.countryName, setData.countryCode);

      await Validate.hidden(signupPage.passwordError);
      await Validate.visible(signupPage.strongPasswordIndicator);
      await Validate.clickable(signupPage.createAccountButton);
    });
  }

  for (const setData of formDataUS) {
    test(
      `Create Account can be clicked after selecting ${setData.stateName}, United States`,
      Markers(TestTags.REGRESSION),
      async ({ signupPage }) => {
        await signupPage.goto();

        await Validate.visibleAll([
          signupPage.heading,
          signupPage.emailInput,
          signupPage.passwordInput,
          signupPage.nicknameInput,
          signupPage.countryDropdown,
          signupPage.createAccountButton,
        ]);
        await signupPage.fillAccountDetails(setData.email, setData.password, setData.nickname);
        await signupPage.selectCountry(setData.countryName, setData.countryCode);
        await Validate.visible(signupPage.stateDropdown);
        await signupPage.selectState(setData.stateName);

        await Validate.hidden(signupPage.passwordError);
        await Validate.visible(signupPage.strongPasswordIndicator);
        await Validate.clickable(signupPage.createAccountButton);
      },
    );
  }
});
