import chalk from "chalk";

export const info = (...messages) =>
  console.log(chalk.blue("[INFO]"), ...messages);
export const warn = (...messages) =>
  console.log(chalk.yellow("[WARN]"), ...messages);
export const success = (...messages) =>
  console.log(chalk.green("[SUCCESS]"), ...messages);
export const errorPrc = (...messages) =>
  console.log(chalk.red("[PRCERROR]"), ...messages);
