import { existsSync, statSync } from "node:fs";
import { resolve } from "node:path";

import { InvalidArgumentError } from "commander";

export function parsePositiveInteger(value: string): number {
  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue < 1) {
    throw new InvalidArgumentError("Expected a positive integer.");
  }

  return parsedValue;
}

export function parseNonEmptyValue(value: string): string {
  const normalizedValue = value.trim();

  if (normalizedValue.length === 0) {
    throw new InvalidArgumentError("Expected a non-empty value.");
  }

  return normalizedValue;
}

export function parseRegularExpression(value: string): string {
  const pattern = parseNonEmptyValue(value);

  try {
    new RegExp(pattern);
  } catch {
    throw new InvalidArgumentError(`Invalid regular expression: ${pattern}`);
  }

  return pattern;
}

export function parseFileSelector(value: string): string {
  const selector = parseNonEmptyValue(value);
  const { filePath, line } = splitFileSelector(selector);
  const absoluteFilePath = resolve(filePath);

  if (!existsSync(absoluteFilePath) || !statSync(absoluteFilePath).isFile()) {
    throw new InvalidArgumentError(`Test file does not exist: ${filePath}`);
  }

  return line === undefined ? filePath : `${filePath}:${line}`;
}

function splitFileSelector(selector: string): { filePath: string; line?: number } {
  const separatorIndex = selector.lastIndexOf(":");

  if (separatorIndex === -1) {
    return { filePath: selector };
  }

  const possibleLine = selector.slice(separatorIndex + 1);

  if (!/^\d+$/.test(possibleLine)) {
    return { filePath: selector };
  }

  const line = Number(possibleLine);

  if (!Number.isInteger(line) || line < 1) {
    throw new InvalidArgumentError("The file line number must be a positive integer.");
  }

  return {
    filePath: selector.slice(0, separatorIndex),
    line,
  };
}
