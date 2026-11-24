export class Templater {
  static replace(template: string, placeholder: string, value: string): string {
    return template.replaceAll(placeholder, () => value);
  }
}
