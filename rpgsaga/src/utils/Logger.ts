export class Logger {
  private static logs: string[] = [];

  static log(message: string): void {
    console.log(message);
    this.logs.push(message);
  }

  static clear(): void {
    this.logs = [];
  }

  static getLogs(): string[] {
    return [...this.logs];
  }
}