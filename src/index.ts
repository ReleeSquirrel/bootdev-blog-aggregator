import { CommandsRegistry, middlewareLoggedIn, registerCommand, runCommand } from "./commands/command_registry";
import { handlerLogin } from "./commands/handler_login";
import { handlerRegister } from "./commands/handler_register";
import { handlerReset } from "./commands/handler_reset";
import { handlerUsers } from "./commands/handler_users";
import { handlerAgg } from "./commands/handler_agg";
import { handlerFeeds } from "./commands/handler_feeds";
import { handlerFollow } from "./commands/handler_follow";
import { handlerFollowing } from "./commands/handler_following";
import { handlerAddFeed } from "./commands/handler_add_feed";
import { handlerUnfollow } from "./commands/handler_unfollow";

/**
 * Entry point to the application
 */
async function main(): Promise<void> {
  const commandInput = process.argv.slice(2);

  if (commandInput.length < 1) {
    console.log("usage: cli <command> [args...]");
    process.exit(1);
  }

  const commandsRegistry: CommandsRegistry = {} as CommandsRegistry;
  await registerCommands(commandsRegistry);
  if (!(commandInput[0] in commandsRegistry)){
    console.log("Error: Unknown command.");
    process.exit(1);
  }

  try {
    await runCommand(commandsRegistry, commandInput[0], ...commandInput.slice(1));
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Error running command ${commandInput[0]}: ${err.message}`);
    } else {
      console.error(`Error running command ${commandInput[0]}: ${err}`);
    }
    process.exit(1);
  }

  process.exit(0);
}

async function registerCommands(registry: CommandsRegistry): Promise<void> {
  registerCommand(registry, "login", handlerLogin);
  registerCommand(registry, "register", handlerRegister);
  registerCommand(registry, "reset", handlerReset);
  registerCommand(registry, "users", handlerUsers);
  registerCommand(registry, "agg", handlerAgg);
  registerCommand(registry, "addfeed", await middlewareLoggedIn(handlerAddFeed));
  registerCommand(registry, "feeds", handlerFeeds);
  registerCommand(registry, "follow", await middlewareLoggedIn(handlerFollow));
  registerCommand(registry, "following", await middlewareLoggedIn(handlerFollowing));
  registerCommand(registry, "unfollow", await middlewareLoggedIn(handlerUnfollow));
}

main();