import migrationRunner from "node-pg-migrate";
import {resolve} from "node:path";
import database from "infra/database.js";

export default async function migrations(request, response) {
	const method = request.method;

	const allowedMethods = ["GET", "POST"];

	if (!allowedMethods.includes(method))
		return response.status(405).json({
			error: ` Method ${method} not allowed`,
		});

	let dbClient;

	try {
		dbClient = await database.getNewClient();

		const migrationOptions = {
			dbClient: dbClient,
			databaseUrl: process.env.DATABASE_URL,
			dir: resolve("infra", "migrations"),
			direction: "up",
			verbose: true,
			dryRun: method == "GET",
			migrationsTable: "pgmigrations",
		};
		const migrations = await migrationRunner(migrationOptions);
		const statusCode = method == "POST" && migrations.length > 0 ? 201 : 200;

		return response.status(statusCode).json(migrations);
	} catch (error) {
		console.error(error);
		throw error;
	} finally {
		await dbClient.end();
	}
}

