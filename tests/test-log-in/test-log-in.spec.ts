import { test } from "../../infra/core/fixtures/email.fixture";
import { Markers, TestTags } from "../../infra/utils/markers.util";

test.describe("Logginng with existing login + password.", () => {
  test("Log in test.", Markers(), async ({ mailClient, loginPage, twoFactorVerifyPage }) => {
    const since = new Date();
    await loginPage.goto();
    await loginPage.login("second@sandbox.zazamail.link", "!Test12345!");
    await twoFactorVerifyPage.waitForRedirect();
    const verificationCode: string = await mailClient.GetEmailOneTimeLoginPass(since);
    await twoFactorVerifyPage.fillCodeInput1(verificationCode.charAt(0));
    await twoFactorVerifyPage.fillCodeInput2(verificationCode.charAt(1));
    await twoFactorVerifyPage.fillCodeInput3(verificationCode.charAt(2));
    await twoFactorVerifyPage.fillCodeInput4(verificationCode.charAt(3));
    await twoFactorVerifyPage.fillCodeInput5(verificationCode.charAt(4));
    await twoFactorVerifyPage.fillCodeInput6(verificationCode.charAt(5));
    await twoFactorVerifyPage.continue();
    await loginPage.pause();
  });
});
