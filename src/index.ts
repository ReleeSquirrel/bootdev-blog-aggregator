import { readConfig, setUser } from "./config";

/**
 * Entry point to the application
 */
function main(): void {
  setUser("ReleeSquirrel");
  const configData = readConfig();
  console.log(configData);
}

main();