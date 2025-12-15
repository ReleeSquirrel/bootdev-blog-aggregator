import { CommandsRegistry, registerCommand, runCommand } from "./command_registry";
import { readConfig } from "./config";
import { exit } from "node:process";
import { handlerLogin } from "./handler_login";
import { handlerRegister } from "./handler_register";
import { handlerReset } from "./handler_reset";
import { handlerUsers } from "./handler_users";
import { handlerAgg } from "./handler_agg";

/**
 * Entry point to the application
 */
async function main(): Promise<void> {
  const commandsRegistry: CommandsRegistry = {} as CommandsRegistry;
  registerCommands(commandsRegistry);
  const commandInput = process.argv.slice(2);
  if (commandInput.length === 0) {
    console.log("Error: at least one command required");
    exit(1);
  }
  try {
    await runCommand(commandsRegistry, commandInput[0], ...commandInput.slice(1));
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
      exit(1);
    } else {
      console.log("Error: err was not an instance of the Error class");
      exit(1);
    }
  }

  const configData = readConfig();
  console.log(configData);
  process.exit(0);
}

function registerCommands(registry: CommandsRegistry): void {
  registerCommand(registry, "login", handlerLogin);
  registerCommand(registry, "register", handlerRegister);
  registerCommand(registry, "reset", handlerReset);
  registerCommand(registry, "users", handlerUsers);
  registerCommand(registry, "agg", handlerAgg);
}

main();