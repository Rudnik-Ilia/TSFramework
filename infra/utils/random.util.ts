import { randomInt } from "node:crypto";

export class RandomUtil {
  static createRandomNumber(length = 8): string {
    if (!Number.isInteger(length) || length < 1) {
      throw new RangeError("Random number length must be a positive integer.");
    }

    return Array.from({ length }, () => randomInt(0, 10)).join("");
  }

  static createReportName(namePrefix: string, randomNumberLength = 8): string {
    const dateTime = new Date().toISOString().slice(0, 19).replace("T", "-");

    return `${namePrefix}-${dateTime}-${this.createRandomNumber(randomNumberLength)}`;
  }
}
