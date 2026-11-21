export type TestCommandMode = "run" | "list" | "debug";

export interface TestCommandOptions {
  readonly smoke?: boolean;
  readonly regression?: boolean;
  readonly browser?: string;
  readonly workers?: number;
  readonly headed?: boolean;
  readonly grep?: string;
  readonly file?: string;
  readonly parallel?: boolean;
}
