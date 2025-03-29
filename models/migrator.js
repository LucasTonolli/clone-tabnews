import { resolve } from "node:path";
import migrationRunner from "node-pg-migrate";
import database from "infra/database.js";
import { ServiceError } from "infra/errors";

const defaultMigrationOptions = {
  databaseUrl: process.env.DATABASE_URL,
  dir: resolve("infra", "migrations"),
  direction: "up",
  verbose: true,
  migrationsTable: "pgmigrations",
};

async function listPendingMigrations() {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const pendingMigrations = await migrationRunner({
      dbClient,
      ...defaultMigrationOptions,
    });

    return pendingMigrations;
  } finally {
    await dbClient?.end();
  }
}

async function runPendingMigrations() {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const migratedMigrations = await migrationRunner({
      dbClient,
      ...defaultMigrationOptions,
      dryRun: false,
    });

    return migratedMigrations;
  } catch (error) {
    const serviceErrorObject = new ServiceError({
      message: "Erro na conexão com  Banco ou na Query.",
      cause: error,
    });

    throw serviceErrorObject;
  } finally {
    await dbClient?.end();
  }
}

const migrator = {
  listPendingMigrations,
  runPendingMigrations,
};

export default migrator;
