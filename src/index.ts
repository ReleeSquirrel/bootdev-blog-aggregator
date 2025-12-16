import { CommandsRegistry, registerCommand, runCommand } from "./commands/command_registry";
import { readConfig } from "./config";
import { exit } from "node:process";
import { handlerLogin } from "./commands/handler_login";
import { handlerRegister } from "./commands/handler_register";
import { handlerReset } from "./commands/handler_reset";
import { handlerUsers } from "./commands/handler_users";
import { handlerAgg } from "./commands/handler_agg";
import { handlerAddFeed } from "./commands/handler_add_feed";
import { handlerFeeds } from "./commands/handler_feeds";

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
  if (!(commandInput[0] in commandsRegistry)){
    console.log("Error: unknown command");
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

  process.exit(0);
}

function registerCommands(registry: CommandsRegistry): void {
  registerCommand(registry, "login", handlerLogin);
  registerCommand(registry, "register", handlerRegister);
  registerCommand(registry, "reset", handlerReset);
  registerCommand(registry, "users", handlerUsers);
  registerCommand(registry, "agg", handlerAgg);
  registerCommand(registry, "addfeed", handlerAddFeed);
  registerCommand(registry, "feeds", handlerFeeds);
}

main();