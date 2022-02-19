# Northcoders News API

This is my JavaScript News API, built using RESTful techniques to interact with a database: https://news-api-jw.herokuapp.com

This is a reddit-style API, where users can view and amend articles, view, post and delete comments, view topics of article, and view other users.

## Installation

Clone this project from GitHub into your chosen directory using `git clone https://github.com/jothwas/news-api-jw.git`

This project has a number of dependencies and dev dependencies to ensure full functionality.

After cloning the repository from GitHub, ensure you `cd` into the repo and install these dependencies with the following command:

```bash
  npm i
```

## .env

To access the data from the SQL files you will need to create two .env files in your project directory to access both the test and development data.

```bash
.env.development
.env.test
```

Both files should contain the following lines of code: `PGDATABASE=<database_name_here>`, replacing the placeholder with the name of your test and development database stating the database for each of the files.

You can find an example of what this should look like in the `.env-example` file.

The database names can be found in the .sql file in the `/db` folder.

Please ensure these files names are added to the `.gitignore` file.

## Seeding

Following installation of the required dependencies and creation of your .env files, you now need to set-up the database we will be working with and seed the data.

Initialise a new database:

```bash
npm run setup-dbs
```

You can now seed the database with data:

```bash
npm run seed
```

## Testing

The database utilises Jest for testing. This should have been installed after running `npm i` earlier in the setup.

To run Jest, enter the command:

```bash
npm t
```

Jest will then run the test suites within the project.

## Minimum Versions

To ensure the app runs correctly, please ensure you have the following software versions installed as a minimum:

```bash
Node.js: v17.3.1
Postgres: 14.1
```

To check your current Node version, input into the command line:

```bash
node -v
```

To check your current Postgres version, input into the command line:

```bash
psql -V
```
