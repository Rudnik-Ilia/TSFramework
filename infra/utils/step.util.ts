import { test } from "@playwright/test";

export function step<Instance extends object, MethodArguments extends unknown[], MethodResult>(
  originalMethod: (this: Instance, ...argumentsList: MethodArguments) => Promise<MethodResult>,
  context: ClassMethodDecoratorContext,
) {
  return function (this: Instance, ...argumentsList: MethodArguments): Promise<MethodResult> {
    const stepName = `${this.constructor.name}.${String(context.name)}`;

    return test.step(stepName, () => originalMethod.apply(this, argumentsList), { box: true });
  };
}
