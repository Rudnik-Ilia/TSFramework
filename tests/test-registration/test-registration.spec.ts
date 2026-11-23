import { test } from "../../infra/core/fixtures/email.fixture";
import { testMetadata, TestTags } from "../../infra/core/markers/markers-metadata";

const data = {
  email: "second@sandbox.zazamail.link",
  password: "test_user",
  nickname: "tu",
  countryName: "Canada",
  countryCode: "CA",
};
// https://app.canary.talkspace.com/email-verification/otp?email=second%40sandbox.zazamail.link&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjYzNDY0MDksInJlc291cmNlIjpbeyJwYXRoIjoiL3YyL3VzZXJzLzYzNDY0MDkvYmFzaWMtZGV0YWlscyIsIm1ldGhvZCI6IlBBVENIIiwicGF5bG9hZCI6eyJhbGxvd2VkQ29sdW1ucyI6WyJlbWFpbCJdfX1dLCJpYXQiOjE3OTU0MzMxMTQsImV4cCI6MTc5NTQzMzcxNCwiaXNzIjoiYXV0aC1hcGkiLCJqdGkiOiJzbm5ta0xOT00xV1FubWp6dlFEaURKWGZNcXVTNFpzYVpDdmJkVE4tUHVRIn0.iIKkILhQAnRdCEhF_ovO31SWtpnrwD0SONucnKN5jm0&firstName=null&otpToken=wU4mELHTjcFzQMj_4s1vlYpxoJm-vkVkoOzKTlu-tHMDlGLpgd5P-xwrjjdzc8hqiYREgmnjaMpcmWQ9m5YJiA
//

test.describe("Signup", () => {
  test("Register flow", testMetadata("", TestTags.SANITY), async ({ mailClient }) => {
    const verificationCode1: string = await mailClient.GetEmailVerificationCode();
    const verificationCode: string = await mailClient.GetEmailOneTimeLoginPass();
  });
});
