import orchestrator from "tests/orchestrator";
import { version as uuidVersion } from "uuid";
import password from "models/password";
import user from "models/user.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("PATCH /api/v1/users/[username]", () => {
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

    test("With nonexistent 'username'", async () => {
      const patchUserResponse = await fetch(
        "http://localhost:3000/api/v1/users/usuarioInexistente",
        {
          method: "PATCH",
        },
      );
      expect(patchUserResponse.status).toBe(404);

      const getUserResponseBody = await patchUserResponse.json();
      expect(getUserResponseBody).toEqual({
        name: "NotFoundError",
        message: "O username informado não foi encontrado no sistema.",
        action: "Verifique se o username está digitado corretamente.",
        status_code: 404,
      });
    });

    test("With duplicated 'username'", async () => {
      args.options.body = JSON.stringify({
        username: "user1",
        email: "user1@dev.com",
        password: "123",
      });

      const user1Response = await fetch(args.url, args.options);
      expect(user1Response.status).toBe(201);

      args.options.body = JSON.stringify({
        username: "user2",
        email: "user2@dev.com",
        password: "123",
      });

      const user2Response = await fetch(args.url, args.options);
      expect(user2Response.status).toBe(201);

      const patchResponse = await fetch(
        "http://localhost:3000/api/v1/users/user2",
        {
          method: "PATCH",
          body: JSON.stringify({
            username: "user1",
          }),
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      expect(patchResponse.status).toBe(400);

      const patchResponseBody = await patchResponse.json();

      expect(patchResponseBody).toEqual({
        name: "ValidationError",
        message: "O username informado já esta sendo utilizado.",
        action: "Utilize outro username para realizar esta operação.",
        status_code: 400,
      });
    });

    test("With duplicated 'email'", async () => {
      args.options.body = JSON.stringify({
        username: "email1",
        email: "email1@dev.com",
        password: "123",
      });

      const user1Response = await fetch(args.url, args.options);
      expect(user1Response.status).toBe(201);

      args.options.body = JSON.stringify({
        username: "email2",
        email: "email2@dev.com",
        password: "123",
      });

      const user2Response = await fetch(args.url, args.options);
      expect(user2Response.status).toBe(201);

      const patchResponse = await fetch(
        "http://localhost:3000/api/v1/users/email2",
        {
          method: "PATCH",
          body: JSON.stringify({
            email: "email1@dev.com",
          }),
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      expect(patchResponse.status).toBe(400);

      const patchResponseBody = await patchResponse.json();

      expect(patchResponseBody).toEqual({
        name: "ValidationError",
        message: "O email informado já esta sendo utilizado.",
        action: "Utilize outro email para realizar esta operação.",
        status_code: 400,
      });
    });

    test("With unique 'username'", async () => {
      args.options.body = JSON.stringify({
        username: "userunique",
        email: "userunique@dev.com",
        password: "123",
      });

      const user1Response = await fetch(args.url, args.options);
      expect(user1Response.status).toBe(201);

      const patchResponse = await fetch(
        "http://localhost:3000/api/v1/users/userunique",
        {
          method: "PATCH",
          body: JSON.stringify({
            username: "userunique2",
          }),
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      expect(patchResponse.status).toBe(200);

      const patchResponseBody = await patchResponse.json();

      expect(patchResponseBody).toEqual({
        id: patchResponseBody.id,
        username: "userunique2",
        email: "userunique@dev.com",
        password: patchResponseBody.password,
        created_at: patchResponseBody.created_at,
        updated_at: patchResponseBody.updated_at,
      });

      expect(uuidVersion(patchResponseBody.id)).toBe(4);
      expect(Date.parse(patchResponseBody.created_at)).not.toBeNaN();
      expect(Date.parse(patchResponseBody.updated_at)).not.toBeNaN();
      expect(patchResponseBody.updated_at > patchResponseBody.created_at).toBe(
        true,
      );
    });

    test("With unique 'email'", async () => {
      args.options.body = JSON.stringify({
        username: "useruniqueemail",
        email: "useruniqueemail@dev.com",
        password: "123",
      });

      const user1Response = await fetch(args.url, args.options);
      expect(user1Response.status).toBe(201);

      const patchResponse = await fetch(
        "http://localhost:3000/api/v1/users/useruniqueemail",
        {
          method: "PATCH",
          body: JSON.stringify({
            email: "useruniqueemail2@dev.com",
          }),
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      expect(patchResponse.status).toBe(200);

      const patchResponseBody = await patchResponse.json();

      expect(patchResponseBody).toEqual({
        id: patchResponseBody.id,
        username: "useruniqueemail",
        email: "useruniqueemail2@dev.com",
        password: patchResponseBody.password,
        created_at: patchResponseBody.created_at,
        updated_at: patchResponseBody.updated_at,
      });

      expect(uuidVersion(patchResponseBody.id)).toBe(4);
      expect(Date.parse(patchResponseBody.created_at)).not.toBeNaN();
      expect(Date.parse(patchResponseBody.updated_at)).not.toBeNaN();
      expect(patchResponseBody.updated_at > patchResponseBody.created_at).toBe(
        true,
      );
    });

    test("With new 'password'", async () => {
      args.options.body = JSON.stringify({
        username: "usernewpass",
        email: "usernewpass@dev.com",
        password: "123",
      });

      const user1Response = await fetch(args.url, args.options);
      expect(user1Response.status).toBe(201);

      const patchResponse = await fetch(
        "http://localhost:3000/api/v1/users/usernewpass",
        {
          method: "PATCH",
          body: JSON.stringify({
            password: "123456",
          }),
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      expect(patchResponse.status).toBe(200);

      const patchResponseBody = await patchResponse.json();

      expect(patchResponseBody).toEqual({
        id: patchResponseBody.id,
        username: "usernewpass",
        email: "usernewpass@dev.com",
        password: patchResponseBody.password,
        created_at: patchResponseBody.created_at,
        updated_at: patchResponseBody.updated_at,
      });

      expect(uuidVersion(patchResponseBody.id)).toBe(4);
      expect(Date.parse(patchResponseBody.created_at)).not.toBeNaN();
      expect(Date.parse(patchResponseBody.updated_at)).not.toBeNaN();
      expect(patchResponseBody.updated_at > patchResponseBody.created_at).toBe(
        true,
      );

      const userInDatabase = await user.findOneByUsername("usernewpass");
      const correctPasswordMatch = await password.compare(
        "123456",
        userInDatabase.password,
      );

      expect(correctPasswordMatch).toBe(true);

      const incorrectPasswordMatch = await password.compare(
        "123",
        userInDatabase.password,
      );

      expect(incorrectPasswordMatch).toBe(false);
    });
  });
});
