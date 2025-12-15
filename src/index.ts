import { CommandsRegistry, registerCommand, runCommand } from "./command_registry.js";
import { handlerLogin } from "./handler_login.js";
import { readConfig } from "./config.js";
import { exit } from "node:process";

/**
 * Entry point to the application
 */
function main(): void {
  const commandsRegistry: CommandsRegistry = {} as CommandsRegistry;
  registerCommand(commandsRegistry, "login", handlerLogin);
  const commandInput = process.argv.slice(2);
  if (commandInput.length === 0) {
    console.log("at least one command required");
    exit(1);
  }
  try {
    runCommand(commandsRegistry, commandInput[0], ...commandInput.slice(1));
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
      exit(1);
    }
  }

  const configData = readConfig();
  console.log(configData);
}

main();