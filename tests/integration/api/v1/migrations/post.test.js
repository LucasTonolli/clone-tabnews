import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
});

describe("POST /api/v1/migrations", () => {
  describe("Anonymous user", () => {
    describe("Running pending migrations", () => {
      const args = {
        url: "http://localhost:3000/api/v1/migrations",
        options: {
          method: "POST",
        },
      };

      test("For the first time", async () => {
        const responsePending = await fetch(args.url, args.options);
        expect(responsePending.status).toBe(201);

        const responseBody = await responsePending.json();

        expect(Array.isArray(responseBody)).toBe(true);
        expect(responseBody.length).toBeGreaterThan(0);
      });

      test("For the second time", async () => {
        const responseWithoutMigrations = await fetch(args.url, args.options);

        expect(responseWithoutMigrations.status).toBe(200);

        const responseWithoutMigrationsBody =
          await responseWithoutMigrations.json();
        expect(Array.isArray(responseWithoutMigrationsBody)).toBe(true);

        expect(responseWithoutMigrationsBody.length).toBe(0);
      });
    });
  });
});
