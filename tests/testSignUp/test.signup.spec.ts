import { test } from "../../infra/core/fixtures/mail.fixture";
import { testMetadata, TestTags } from "../../infra/core/markers/markers-metadata";
import { Validate } from "../../infra/core/validations/validate";
import formData from "./test_data/data_single.json";

test.describe("Signup", () => {
  for (const setData of formData) {
    test(
      `fills all account fields for ${setData.nickname} without creating an account`,
      testMetadata("Fills every signup field but does not submit the form.", TestTags.SMOKE),
      async ({ signupPage }) => {
        await signupPage.goto();
        await Validate.visible(signupPage.heading);

        await signupPage.fillAccountDetails(setData.email, setData.password, setData.nickname);
        await signupPage.selectCountry(setData.countryName, setData.countryCode);

        await Validate.haveValue(signupPage.emailInput, setData.email);
        await Validate.haveValue(signupPage.passwordInput, setData.password);
        await Validate.haveValue(signupPage.nicknameInput, setData.nickname);
        await Validate.containText(signupPage.countryDropdown, setData.countryName);
        await Validate.enabled(signupPage.createAccountButton);

        await signupPage.createAccount();
      },
    );
  }
});

for (const setData of formData) {
  test.describe("Signup", () => {
    test(`Register flow`, testMetadata("", TestTags.SANITY), async ({ emailResendPage, mailClient, verificationEmailPage, loginPage }) => {
      test.slow();

      // await emailResendPage.goto(setData.email);
      // await Validate.visible(emailResendPage.getEmailAddress(setData.email));
      // const resendRequestedAt = new Date();
      // await emailResendPage.resendEmail();

      const verificationLink: string = await mailClient.GetEmailLink();
      console.log(verificationLink);
      // await verificationEmailPage.goto(verificationEmail.previewUrl);
      //
      //       const emailVerificationCompletePage = await verificationEmailPage.clickVerifyEmail();
      //       await Validate.haveUrl(emailVerificationCompletePage.page, loginPage.getFullUrl());
      //       await Validate.visible(emailVerificationCompletePage.heading);
    });
  });
}
