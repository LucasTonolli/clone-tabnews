import email from "infra/email";
import orchestrator from "tests/orchestrator";

describe("infra/email.js", () => {
  test("send", async () => {
    await orchestrator.deleteAllEmails();
    await email.send({
      from: "Teste <O0r6A@example.com>",
      to: "Teste <teste@example.com>",
      subject: "Teste",
      text: "Teste corpo.",
    });

    await email.send({
      from: "Teste <O0r6A@example.com>",
      to: "Teste <teste@example.com>",
      subject: "Último email",
      text: "Último corpo.",
    });

    const lastEmail = await orchestrator.getLastEmail();
    console.log(lastEmail);

    expect(lastEmail.sender).toBe("<O0r6A@example.com>");
    expect(lastEmail.recipients[0]).toBe("<teste@example.com>");
    expect(lastEmail.subject).toBe("Último email");
    expect(lastEmail.text).toBe("Último corpo.\r\n");
  });
});
