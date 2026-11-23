import { test } from "../../infra/core/fixtures/email.fixture";
import { Markers, TestTags } from "../../infra/core/markers/markers.collection";
import { Validate } from "../../infra/core/validations/validate.validation";
import { WelcomeTalkspace } from "../../infra/domain/web/pages/welcome-talkspace.page";
import formData from "./test-data/form-single.data.json";

test.describe("Signup", () => {
  for (const setData of formData) {
    test(`fills all account fields for ${setData.nickname} without creating an account`, Markers(TestTags.SMOKE), async ({ signupPage }) => {
      await signupPage.goto();
      await Validate.visible(signupPage.heading);

      await signupPage.fillAccountDetails(setData.email, setData.password, setData.nickname);
      await signupPage.selectCountry(setData.countryName, setData.countryCode);
      // await signupPage.createAccount();
    });
  }
});

for (const setData of formData) {
  test.describe("Signup", () => {
    test(`Register flow`, Markers(TestTags.SMOKE), async ({ emailResendPage, mailClient, welcomeTalkspace, loginPage }) => {
      await emailResendPage.goto(setData.email);
      await Validate.visible(emailResendPage.getEmailAddress(setData.email));
      // await emailResendPage.resendEmail();

      const verificationLink: string = await mailClient.GetEmailLink();
      await welcomeTalkspace.goto(verificationLink);
      await welcomeTalkspace.verifySucces();
    });
  });
}
