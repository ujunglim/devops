export default class Debug {
  static colors: any = {
    RESET: "\x1b[0m",
    RED: "\x1b[31m",
    GREEN: "\x1b[32m",
    YELLOW: "\x1b[33m"
  };

  public static log(...args: any[]) {
    const date = new Date().toLocaleTimeString();
    console.log(date, ...args);
  }

  public static error(...args: any[]) {
    const date = new Date().toLocaleTimeString();
    console.error(date, ...args);
  }
}