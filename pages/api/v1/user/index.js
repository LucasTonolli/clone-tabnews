import { createRouter } from "next-connect";
import controller from "infra/controller";
import user from "models/user.js";
import session from "models/session";

const router = createRouter();

router.get(getHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const sessionToken = request.cookies.session_id;
  const validSession = await session.findOneValidByToken(sessionToken);

  const renewedSession = await session.renew(validSession.id);

  controller.setSessionCookie(renewedSession.token, response);

  const userFound = await user.findOneById(validSession.user_id);

  return response.status(200).json(userFound);
}
