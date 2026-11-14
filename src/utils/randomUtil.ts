import { randomUUID } from "node:crypto";

export function reportId(): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const uniqueId = randomUUID().slice(0, 8);
  return `${timestamp}-${uniqueId}`;
}
