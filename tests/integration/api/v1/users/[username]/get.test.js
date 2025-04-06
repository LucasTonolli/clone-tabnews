import orchestrator from "tests/orchestrator";
import { version as uuidVersion } from "uuid";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET /api/v1/users/[username]", () => {
  describe("Anonymous user", () => {
    test("With exact case match", async () => {
      const createUserResponse = await fetch(
        "http://localhost:3000/api/v1/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: "lucasTonolli",
            email: "dev@dev.com",
            password: "123",
          }),
        },
      );

      expect(createUserResponse.status).toBe(201);

      const getUserResponse = await fetch(
        "http://localhost:3000/api/v1/users/lucasTonolli",
      );
      expect(getUserResponse.status).toBe(200);

      const getUserResponseBody = await getUserResponse.json();
      expect(getUserResponseBody).toEqual({
        id: getUserResponseBody.id,
        username: "lucasTonolli",
        email: "dev@dev.com",
        password: "123",
        created_at: getUserResponseBody.created_at,
        updated_at: getUserResponseBody.updated_at,
      });

      expect(uuidVersion(getUserResponseBody.id)).toBe(4);
      expect(Date.parse(getUserResponseBody.created_at)).not.toBeNaN();
      expect(Date.parse(getUserResponseBody.updated_at)).not.toBeNaN();
    });

    test("With case mismatch", async () => {
      const getUserResponse = await fetch(
        "http://localhost:3000/api/v1/users/lucastonolli",
      );
      expect(getUserResponse.status).toBe(200);

      const getUserResponseBody = await getUserResponse.json();
      expect(getUserResponseBody).toEqual({
        id: getUserResponseBody.id,
        username: "lucasTonolli",
        email: "dev@dev.com",
        password: "123",
        created_at: getUserResponseBody.created_at,
        updated_at: getUserResponseBody.updated_at,
      });

      expect(uuidVersion(getUserResponseBody.id)).toBe(4);
      expect(Date.parse(getUserResponseBody.created_at)).not.toBeNaN();
      expect(Date.parse(getUserResponseBody.updated_at)).not.toBeNaN();
    });

    test("With nonexistent username", async () => {
      const getUserResponse = await fetch(
        "http://localhost:3000/api/v1/users/usuarioInexistente",
      );
      expect(getUserResponse.status).toBe(404);

      const getUserResponseBody = await getUserResponse.json();
      expect(getUserResponseBody).toEqual({
        name: "NotFoundError",
        message: "O username informado não foi encontrado no sistema.",
        action: "Verifique se o username está digitado corretamente.",
        status_code: 404,
      });
    });
  });
});
