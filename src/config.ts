import fs from "fs";
import os from "os";
import path from "path";

const configFileName = ".gatorconfig.json"

/**
 * A type matching the schema of the config file
 */
export type Config = {
    dbUrl: string,
    currentUserName: string,
}

/**
 * Sets the user name in the config file
 * @param userName The user name to set
 */
export function setUser(userName: string): void {
    const workingConfig = readConfig();
    workingConfig.currentUserName = userName;
    writeConfig(workingConfig);
}

/**
 * Reads the data in the config file and returns it
 * @returns A Config object containing the contents of the config file
 */
export function readConfig(): Config {
    const configFileRaw = fs.readFileSync(getConfigFilePath(), { "encoding" : "utf-8" });
    const configFileJSON = JSON.parse(configFileRaw);
    return validateConfig(configFileJSON);
}

/**
 * Returns the path to the config file
 * @returns A string containing the path to the config file
 */
function getConfigFilePath(): string {
    return path.join(os.homedir(), configFileName);
}

/**
 * Writes the data from a Config object into the config file
 * @param cfg A Config object whose data to write into the config file
 */
function writeConfig(cfg: Config): void {
    const writeConfig = {
        db_url: cfg.dbUrl,
        current_user_name: cfg.currentUserName
    };
    fs.writeFileSync(getConfigFilePath(), JSON.stringify(writeConfig, null, 2), { "encoding" : "utf-8" });
}

/**
 * Validates a Config object
 * @param rawConfig The parsed data from a file load to be validated
 * @returns A valid Config object based on the input
 */
function validateConfig(rawConfig: any): Config {
    if (!rawConfig || typeof rawConfig !== "object") {
        throw new Error("Error: Invalid Config Data");
    }
    if (typeof rawConfig.db_url !== "string") {
        throw new Error("Error: Invalid Config Data - db_url property is not a string");
    }
    if ('current_user_name' in rawConfig) {
        if (typeof rawConfig.current_user_name !== "string") {
            throw new Error("Error: Invalid Config Data - current_user_name property is not a string");
        }
    } else {
        rawConfig.current_user_name = undefined;
    }

    const result: Config = {
        dbUrl: rawConfig.db_url,
        currentUserName: rawConfig.current_user_name
    };

    return result;
}