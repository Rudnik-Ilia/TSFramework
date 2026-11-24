import { test } from "../../infra/core/fixtures/pages.fixture";
import { Validate } from "../../infra/core/validations/validate.validation";
import { Markers, TestTags } from "../../infra/utils/markers.util";
import formData from "./test-data/form-wrong.data.json";

test.describe("Signup form rejects invalid or incomplete account details", () => {
  const { validDetails, invalidEmails, missingRequiredFields } = formData;

  for (const { description, email } of invalidEmails) {
    test(`shows an email format warning for ${description}`, Markers(TestTags.REGRESSION), async ({ signupPage }) => {
      await signupPage.goto();
      await signupPage.fillAccountDetails(email, validDetails.password, validDetails.nickname);
      await signupPage.selectCountry(validDetails.countryName, validDetails.countryCode);
      await signupPage.createAccount();

      await signupPage.InvalidEmailFormat();
      await Validate.haveUrl(signupPage.page, signupPage.path);
    });
  }

  for (const missingField of missingRequiredFields) {
    test(`blocks account creation when ${missingField} is empty`, Markers(TestTags.REGRESSION), async ({ signupPage }) => {
      await signupPage.goto();
      await signupPage.fillAccountDetails(
        missingField === "email" ? "" : validDetails.email,
        missingField === "password" ? "" : validDetails.password,
        missingField === "nickname" ? "" : validDetails.nickname,
      );
      await signupPage.selectCountry(validDetails.countryName, validDetails.countryCode);
      await signupPage.createAccount();

      const requiredFields = new Map([
        ["email", signupPage.emailInput],
        ["password", signupPage.passwordInput],
        ["nickname", signupPage.nicknameInput],
      ]);
      const emptyInput = requiredFields.get(missingField);
      if (!emptyInput) {
        throw new Error(`Unknown required signup field: ${missingField}`);
      }

      await Validate.haveValue(emptyInput, "");
      await Validate.haveAttribute(emptyInput, "aria-invalid", "true");
      await Validate.haveUrl(signupPage.page, signupPage.path);
    });
  }
});
