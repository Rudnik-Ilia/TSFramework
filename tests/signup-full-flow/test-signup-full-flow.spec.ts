import type { InboxData } from "../../infra/core/clients/contracts/inbox-id-name.contract";
import { test } from "../../infra/core/fixtures/email.fixture";
import { Validate } from "../../infra/core/validations/validate.validation";
import { Attacher } from "../../infra/utils/attachment.util";
import { Markers, Serial, TestTags } from "../../infra/utils/markers.util";
import { RandomUtil } from "../../infra/utils/random.util";
import { Templater } from "../../infra/utils/template.util";
import formData from "./test-data/form.data.json";

const EMAIL_RANDOM_PLACEHOLDER = "{PLACEHOLDER-RANDOM}";

test.describe("1", () => {
  Serial();
  let inbox: InboxData | undefined;

  test(
    "creates",
    Markers(TestTags.SMOKE),
    async ({
      emailVerificationCodePage,
      signupPage,
      mailClient,
      homePage,
      welcomeTalkspacePage,
      meetYourProviderPage,
      mentalHealthIntakePage,
      medicalHealthIntakePage,
      emergencyContactPage,
    }) => {
      const since = new Date();
      const emailAddress = Templater.replace(formData.email, EMAIL_RANDOM_PLACEHOLDER, RandomUtil.createRandomNumber());
      await mailClient.createNewInbox(emailAddress);
      inbox = mailClient.inboxInfo;
      await Attacher.attachInbox(inbox);

      await signupPage.goto();
      await Validate.visible(signupPage.heading);
      await signupPage.fillAccountDetails(inbox.emailAddress, formData.password, formData.nickname);
      await signupPage.selectCountry(formData.countryName, formData.countryCode);
      await signupPage.createAccount();
      await emailVerificationCodePage.waitForRedirect();

      await Validate.visible(emailVerificationCodePage.title);
      await Validate.containText(emailVerificationCodePage.sentCodeMessage, inbox.emailAddress);

      const verificationCode: string = await mailClient.GetEmailVerificationCode("Verify your email address", since);
      await emailVerificationCodePage.fillCode(verificationCode);

      await welcomeTalkspacePage.verifySucces();

      await meetYourProviderPage.waitForRedirect();
      await meetYourProviderPage.close();

      await mentalHealthIntakePage.waitForRedirect();
      await mentalHealthIntakePage.expectTitleVisible();
      await mentalHealthIntakePage.startIntake();
      await mentalHealthIntakePage.expectGenderIdentityVisible();

      await mentalHealthIntakePage.selectGenderIdentity("Male");
      await mentalHealthIntakePage.selectPreviousMentalHealthTreatment("Therapist");

      await medicalHealthIntakePage.waitForRedirect();
      await medicalHealthIntakePage.skipPrimaryCareDoctor();

      await emergencyContactPage.waitForRedirect();
      await emergencyContactPage.submitFullName(formData.emergencyContactName);
      // TODO: Add validation for every onboarding screen before interacting with it.
      // Up to Home.
    },
  );
});
