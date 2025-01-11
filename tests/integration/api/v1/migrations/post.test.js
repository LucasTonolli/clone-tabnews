import database from "infra/database.js";

async function cleanDatabase() {
	await database.query("DROP SCHEMA public CASCADE; CREATE SCHEMA public;");
}

beforeAll(cleanDatabase);

test("POST to /api/v1/migrations should return 200", async () => {
	const args = {
		url: "http://localhost:3000/api/v1/migrations",
		options: {
			method: "POST",
		},
	};

	const responsePending = await fetch(args.url, args.options);
	expect(responsePending.status).toBe(201);

	const responseBody = await responsePending.json();

	expect(Array.isArray(responseBody)).toBe(true);
	expect(responseBody.length).toBeGreaterThan(0);

	const responseWithoutMigrations = await fetch(args.url, args.options);

	expect(responseWithoutMigrations.status).toBe(200);

	const responseWithoutMigrationsBody = await responseWithoutMigrations.json();
	expect(Array.isArray(responseWithoutMigrationsBody)).toBe(true);

	expect(responseWithoutMigrationsBody.length).toBe(0);
});
