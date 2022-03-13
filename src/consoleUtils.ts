import { ConsoleColours } from 'const';

export const printColoredMessage = (color: ConsoleColours, msg: string): void => {
  console.log(color);
  console.log(msg, ConsoleColours.RESET);
};

export const exitScriptWithMessage = (color: ConsoleColours, msg: string): never => {
  printColoredMessage(color, msg);
  process.exit(0);
};

export const exitScript = (): never =>
  exitScriptWithMessage(ConsoleColours.GREEN, 'I am done... \nHave a nice day!\n');

export const tryValue = (tryValue: any, msg: string): void => {
  if (!tryValue) {
    exitScriptWithMessage(ConsoleColours.RED, msg);
  }
};
