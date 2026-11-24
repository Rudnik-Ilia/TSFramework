import { test } from "../../infra/core/fixtures/email.fixture";
import { Markers, TestTags } from "../../infra/utils/markers.util";
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

test.describe("Signup", () => {
  test("Test", Markers(TestTags.SANITY), async ({ emailVerificationCodePage }) => {
    await emailVerificationCodePage.goto();
    await emailVerificationCodePage.fillCodeInput1("1");
    await emailVerificationCodePage.fillCodeInput2("1");
    await emailVerificationCodePage.fillCodeInput3("1");
    await emailVerificationCodePage.fillCodeInput4("1");
    await emailVerificationCodePage.fillCodeInput5("1");
    await emailVerificationCodePage.fillCodeInput6("1");
    await emailVerificationCodePage.pause();
  });
});
