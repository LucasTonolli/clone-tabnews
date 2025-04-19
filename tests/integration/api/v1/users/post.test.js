import orchestrator from "tests/orchestrator";
import { version as uuidVersion } from "uuid";
import user from "models/user.js";
import password from "models/password";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/users", () => {
  describe("Anonymous user", () => {
    let args = {
      url: "http://localhost:3000/api/v1/users",
      options: {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
    };

    test("With unique and valid data", async () => {
      args.options.body = JSON.stringify({
        username: "lucasTonolli",
        email: "dev@dev.com",
        password: "123",
      });
      const response = await fetch(args.url, args.options);
      expect(response.status).toBe(201);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "lucasTonolli",
        email: "dev@dev.com",
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      const userInDatabase = await user.findOneByUsername("lucasTonolli");
      const correctPasswordMatch = await password.compare(
        "123",
        userInDatabase.password,
      );

      expect(correctPasswordMatch).toBe(true);

      const incorrectPasswordMatch = await password.compare(
        "123456",
        userInDatabase.password,
      );

      expect(incorrectPasswordMatch).toBe(false);
    });

    test("With duplicated 'email'", async () => {
      args.options.body = JSON.stringify({
        username: "emailduplicado1",
        email: "duplicado@dev.com",
        password: "123",
      });

      const reponse1 = await fetch(args.url, args.options);
      expect(reponse1.status).toBe(201);

      args.options.body = JSON.stringify({
        username: "emailduplicado2",
        email: "Duplicado@dev.com",
        password: "123",
      });

      const response2 = await fetch(args.url, args.options);
      const responseBody2 = await response2.json();
      expect(response2.status).toBe(400);
      expect(responseBody2).toEqual({
        name: "ValidationError",
        message: "O email informado já está sendo utilizado.",
        action: "Utilize outro email para realizar o cadastro.",
        status_code: 400,
      });
    });

    test("With duplicated 'username'", async () => {
      args.options.body = JSON.stringify({
        username: "usernameduplicado",
        email: "duplicadoU@dev.com",
        password: "123",
      });

      const reponse1 = await fetch(args.url, args.options);
      expect(reponse1.status).toBe(201);

      args.options.body = JSON.stringify({
        username: "Usernameduplicado",
        email: "duplicadoUser@dev.com",
        password: "123",
      });

      const response2 = await fetch(args.url, args.options);
      const responseBody2 = await response2.json();
      expect(response2.status).toBe(400);
      expect(responseBody2).toEqual({
        name: "ValidationError",
        message: "O username informado já está sendo utilizado.",
        action: "Utilize outro username para realizar o cadastro.",
        status_code: 400,
      });
    });
  });
});
