# bootdev-blog-aggregator aka gator

An RSS Blog Aggregator made for a Boot.dev project. AKA gator.

# Foreward

One of the last steps of the Boot.dev course "Build a Blog Aggregator in Typescript" asks students to do three things. One is to create this document, the other two are things to put in it. Specifically they are "Explain to the user what they'll need to run the CLI." and "Explain to the user how to set up the config file and run the program. Tell them about a few of the commands they can run." I'm leaving this project in a dev state rather than polishing it up, because it's such a weird program. Some of the design choices are based on "Do this so you can learn how to do it!" even though it doesn't fit the tool the project has you create's goal. I'm explaining this so you understand why the steps to set it up are so weird and complex.

# How to Set gator Up

- Download or pull the repo to your local machine
- Install nvm (Node Version Manager), the instructions are here: https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating
- Inside the project directory "/bootdev-blog-aggregator", use the command `nvm use` and it will set things up so you have the correct node version installed
- Install postgresql (PostgreSQL) and set it up as follows. I'll only cover the linux instructions here, I developed this using the ubuntu wsl on Windows 10 and Windows 11.
    - Update with apt first `sudo apt update`
    - Install postegresql `sudo apt install postgresql postgresql-contrib`
    - Make sure you're on version 16+ of postgres with `psql --version`
    - Set up your postgres password, just "postgres" is fine `sudo passwd postgres`
    - Start the postgres server in the background with the command `sudo service postgresql start`
    - Connect to the postgres server with the command `sudo -u postgres psql`
    - You should see a new prompt that looks like `postgres=#`
    - Create a new database named "gator" on the postgres server with the SQL command `CREATE DATABASE gator;`
    - Connect to the new database in psql using the command `\c gator`
    - Set a new password for the database user, this command uses postgres as the password, if you make your own remember it for later `ALTER USER postgres PASSWORD 'postgres';`
    - Exit psql with the command `quit`
- Determine your connection string. It is most likely "postgres://postgres:postgres@localhost:5432/gator?sslmode=disable" but it takes the format "protocol://username:password@host:port/database?sslmode=disable" so if you used a different password when I said to remember it, replace the password section following the username and colon. 
- In your home directory ~ create a new file named `.gatorconfig.json` with the following contents, replacing `<connection_string>` with the text of your connection string:
```
{
  "db_url": "<connection_string>"
}
```
- Set up the database the rest of the way by using this command in the project directory `npx drizzle-kit migrate`

Everything should be set up properly now.

# How to use gator
gator is a command line application. Prefix every command with `npm run start` like `npm run start register releesquirrel`

The commands available in gator:
- `register <username>` to register a new user name. You should do this first.
- `users` prints a list of all registered users.
- `login <username>` changes which user is logged in.
- `addfeed <feed_name> <feed_url>` registers an RSS feed named `<feed_name>` at `<feed_url>` and registers the logged in user to follow that feed.
- `feeds` prints a list of all registered feeds.
- `following <user_name>` prints a list of all feeds that user `<user_name>` is following.
- `follow <url>` registers the logged in user to follow a feed with the url `<url>`.
- `unfollow <url>` unregisters the logged in user from following a feed with the url `<url>`.
- `browse <display_limit>` dispalys a list of the most recent blog entries recorded by gator from the feeds the logged in user follows. `<display_limit>` is the number of entries to show, and is optional. The default is 2.
- `reset` deletes all records in the database, for testing purposes. This removes all users, feeds, records of what feeds users follow, and all aquired posts from RSS feeds.
- `agg <time_between_reqs>` sets gator into "aggregate" mode, downloading data from registered RSS feeds every `<time_between_reqs>`. The application and terminal become unresponsive, exit the program with ctrl-c. `<time_between_reqs>` can be set in ms, s, m, or h, and takes the format "5000ms".