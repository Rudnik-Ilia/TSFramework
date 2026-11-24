import type { InboxData } from "../../infra/core/clients/contracts/inbox-id-name.contract";
import { test } from "../../infra/core/fixtures/email.fixture";
import { Validate } from "../../infra/core/validations/validate.validation";
import { MeetYourProviderPage } from "../../infra/domain/web/pages/log-in/meet-your-provider.page";
import { WelcomeTalkspacePage } from "../../infra/domain/web/pages/log-in/welcome-talkspace.page";
import { Attacher } from "../../infra/utils/attachment.util";
import { Markers, Serial, TestTags } from "../../infra/utils/markers.util";
import formData from "./test-data/form.data.json";

test.describe("Signup from scratch. New user. New email.", () => {
  Serial();
  let inbox: InboxData | undefined;

  test("Test sign up.", Markers(), async ({ emailVerificationCodePage, signupPage, mailClient, homePage, welcomeTalkspacePage }) => {
    const since = new Date();
    await mailClient.createNewInbox(formData.email);
    inbox = mailClient.inboxInfo;
    await Attacher.attachInbox(inbox);

    await signupPage.goto();
    await Validate.visible(signupPage.heading);
    await signupPage.fillAccountDetails(inbox.emailAddress, formData.password, formData.nickname);
    await signupPage.selectCountry(formData.countryName, formData.countryCode);
    await signupPage.createAccount();
    await emailVerificationCodePage.waitForRedirect();

    await Validate.visible(emailVerificationCodePage.title);
    await Validate.visible(emailVerificationCodePage.emailAddress(inbox.emailAddress));

    const verificationCode: string = await mailClient.GetEmailVerificationCode("Verify your email address", since);

    await emailVerificationCodePage.fillCodeInput1(verificationCode.charAt(0));
    await emailVerificationCodePage.fillCodeInput2(verificationCode.charAt(1));
    await emailVerificationCodePage.fillCodeInput3(verificationCode.charAt(2));
    await emailVerificationCodePage.fillCodeInput4(verificationCode.charAt(3));
    await emailVerificationCodePage.fillCodeInput5(verificationCode.charAt(4));
    await emailVerificationCodePage.fillCodeInput6(verificationCode.charAt(5));

    await welcomeTalkspacePage.verifySucces();
  });

  test("", async ({ loginPage, twoFactorVerifyPage, mailClient, mentalHealthIntakePage }) => {
    const since = new Date();
    inbox = mailClient.inboxInfo;
    await Attacher.attachInbox(inbox);

    await loginPage.goto();
    await loginPage.login(inbox.emailAddress, formData.password);
    await twoFactorVerifyPage.waitForRedirect();
    const verificationCode: string = await mailClient.GetEmailOneTimeLoginPass("One time login password", since);
    await twoFactorVerifyPage.fillCodeInput1(verificationCode.charAt(0));
    await twoFactorVerifyPage.fillCodeInput2(verificationCode.charAt(1));
    await twoFactorVerifyPage.fillCodeInput3(verificationCode.charAt(2));
    await twoFactorVerifyPage.fillCodeInput4(verificationCode.charAt(3));
    await twoFactorVerifyPage.fillCodeInput5(verificationCode.charAt(4));
    await twoFactorVerifyPage.fillCodeInput6(verificationCode.charAt(5));
    await twoFactorVerifyPage.continue();

    await mentalHealthIntakePage.expectTitleVisible();
    await mentalHealthIntakePage.startIntake();
  });
});
