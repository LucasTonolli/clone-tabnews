import { createRouter } from "next-connect";
import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database.js";
import controller from "infra/controller.js";

const router = createRouter();

router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.errorHandlers);

const defaultMigrationOptions = {
  databaseUrl: process.env.DATABASE_URL,
  dir: resolve("infra", "migrations"),
  direction: "up",
  verbose: true,
  migrationsTable: "pgmigrations",
};

async function getHandler(request, response) {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const migrations = await migrationRunner({
      dbClient,
      ...defaultMigrationOptions,
    });
    const statusCode = 200;

    return response.status(statusCode).json(migrations);
  } finally {
    await dbClient?.end();
  }
}

async function postHandler(request, response) {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const migrations = await migrationRunner({
      dbClient,
      ...defaultMigrationOptions,
      dryRun: false,
    });
    const statusCode = migrations.length > 0 ? 201 : 200;

    return response.status(statusCode).json(migrations);
  } finally {
    await dbClient?.end();
  }
}
