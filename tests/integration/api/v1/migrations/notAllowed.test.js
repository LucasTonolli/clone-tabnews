import database from "infra/database.js";

async function cleanDatabase() {
	await database.query("DROP SCHEMA public CASCADE; CREATE SCHEMA public;");
}

beforeAll(cleanDatabase);

test("Not allowed methods to /api/v1/migrations should return 405", async () => {
	const notAllowedMethods = ["PUT", "PATCH", "DELETE"];

	for (const method of notAllowedMethods) {
		const args = {
			url: "http://localhost:3000/api/v1/migrations",
			options: {
				method: method,
			},
		};

		const responsePending = await fetch(args.url, args.options);
		expect(responsePending.status).toBe(405);
	}
});
