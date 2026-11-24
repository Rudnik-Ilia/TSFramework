import { test } from "../../infra/core/fixtures/email.fixture";
import { Validate } from "../../infra/core/validations/validate.validation";
import { Markers, TestTags } from "../../infra/utils/markers.util";
import formData from "./test-data/form.data.json";

test.describe("Signup from scratch. New user. New email.", () => {
  test("Test sign up.", Markers(TestTags.SANITY), async ({ emailVerificationCodePage, signupPage, mailClient }) => {
    const since = new Date();
    await signupPage.goto();
    await Validate.visible(signupPage.heading);
    await signupPage.fillAccountDetails(formData.email, formData.password, formData.nickname);
    await signupPage.selectCountry(formData.countryName, formData.countryCode);
    // await signupPage.NOPasswordError();
    // await signupPage.StrongPassword();
    // await signupPage.InvalidEmailFormat();
    await signupPage.createAccount();
    await emailVerificationCodePage.waitForRedirect();
    // await Validate.visible(emailVerificationCodePage.title);
    // await Validate.visible(emailVerificationCodePage.emailAddress(formData.email));
    const verificationCode: string = await mailClient.GetEmailVerificationCode("Verify your email address", since);

    await emailVerificationCodePage.fillCodeInput1(verificationCode.charAt(0));
    await emailVerificationCodePage.fillCodeInput2(verificationCode.charAt(1));
    await emailVerificationCodePage.fillCodeInput3(verificationCode.charAt(2));
    await emailVerificationCodePage.fillCodeInput4(verificationCode.charAt(3));
    await emailVerificationCodePage.fillCodeInput5(verificationCode.charAt(4));
    await emailVerificationCodePage.fillCodeInput6(verificationCode.charAt(5));

    await emailVerificationCodePage.pause();
  });
});
