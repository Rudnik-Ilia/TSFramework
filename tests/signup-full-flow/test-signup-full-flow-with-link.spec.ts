import type { InboxData } from "../../infra/core/clients/contracts/inbox-id-name.contract";
import { test } from "../../infra/core/fixtures/email.fixture";
import { Validate } from "../../infra/core/validations/validate.validation";
import { Attacher } from "../../infra/utils/attachment.util";
import { Markers, Serial, TestTags } from "../../infra/utils/markers.util";
import formData from "./test-data/form.data.json";

test.describe("Signup from scratch. New user. New email.", () => {
  Serial();
  let inbox: InboxData | undefined;

  test("Test sign up.", Markers(), async ({ signupPage, mailClient, welcomeTalkspacePage }) => {
    const since = new Date();
    await mailClient.createNewInbox(formData.email);
    inbox = mailClient.inboxInfo;
    await Attacher.attachInbox(inbox);

    await signupPage.goto();
    await Validate.visible(signupPage.heading);
    await signupPage.fillAccountDetails(inbox.emailAddress, formData.password, formData.nickname);
    await signupPage.selectCountry(formData.countryName, formData.countryCode);
    await signupPage.createAccount();
    const linkVerification = await mailClient.GetEmailLink("Verify your email address", since);

    await welcomeTalkspacePage.goto(linkVerification);
    await welcomeTalkspacePage.verifySucces();
  });

  test("Test", async ({ loginPage, twoFactorVerifyPage, mailClient, mentalHealthIntakePage, meetYourProviderPage, onboardingPage }) => {
    const since = new Date();
    inbox = mailClient.inboxInfo;
    await Attacher.attachInbox(inbox);

    await loginPage.goto();
    await loginPage.login(inbox.emailAddress, formData.password);
    await twoFactorVerifyPage.waitForRedirect();
    const verificationCode: string = await mailClient.GetEmailOneTimeLoginPass("One time login password", since);
    await twoFactorVerifyPage.fillCode(verificationCode);
    await onboardingPage.waitForRedirect(() => twoFactorVerifyPage.continue());

    await meetYourProviderPage.waitForRedirect();
    await meetYourProviderPage.close();

    await mentalHealthIntakePage.waitForRedirect();
    await mentalHealthIntakePage.expectTitleVisible();
    await mentalHealthIntakePage.startIntake();
    await mentalHealthIntakePage.expectGenderIdentityVisible();

    await mentalHealthIntakePage.selectGenderIdentity("Male");
  });
});
