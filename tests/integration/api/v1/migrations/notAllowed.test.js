import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
});

describe("Not Allowed methods /api/v1/migrations", () => {
  describe("Anonymous user", () => {
    describe("Retriving MethodNotAllowedError", () => {
      const args = {
        url: "http://localhost:3000/api/v1/migrations",
        options: {
          method: "PUT",
        },
      };

      const expectErrorObject = {
        name: "MethodNotAllowedError",
        message: "Método não permitido para este endpoint.",
        action:
          "Verifique se o método HTTP enviado é válido para esse endoint.",
        status_code: 405,
      };

      test("PUT /api/v1/migrations", async () => {
        const response = await fetch(args.url, args.options);
        expect(response.status).toBe(405);

        const responseBody = await response.json();

        expect(responseBody).toEqual(expectErrorObject);
      });

      test("DELETE /api/v1/migrations", async () => {
        args.options.method = "DELETE";

        const response = await fetch(args.url, args.options);

        expect(response.status).toBe(405);

        const responseBody = await response.json();
        expect(responseBody).toEqual(expectErrorObject);
      });
    });
  });
});
