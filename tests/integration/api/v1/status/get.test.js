import orchestrator from "tests/orchestrator";

beforeAll(async () => {
	await orchestrator.waitForAllServices();
});

describe("GET /api/v1/status", () => {
	describe("Anonymous user", () => {
		test("Retrivieng current system status", async () => {
			const response = await fetch("http://localhost:3000/api/v1/status");
			expect(response.status).toBe(200);

			const responseBody = await response.json();

			expect(responseBody.updated_at).toBeDefined();

			const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();
			expect(responseBody.updated_at).toEqual(parsedUpdatedAt);

			expect(responseBody.dependencies.database.version).toContain("16.6");
			expect(responseBody.dependencies.database.max_connections).toBe(100);
			expect(responseBody.dependencies.database.opened_connections).toBe(1);
		});
	});
});

