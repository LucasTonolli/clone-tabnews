import { InternalServerError, MethodNotAllowedError } from "infra/errors";

function onNoMatch(request, response) {
  const publicErrorObject = new MethodNotAllowedError();
  console.log(publicErrorObject);
  response.status(publicErrorObject.statusCode).json(publicErrorObject);
}

function onError(error, request, response) {
  const publicErrorObject = new InternalServerError({
    cause: error,
    statusCode: error.statusCode,
  });

  console.log(publicErrorObject);

  response.status(publicErrorObject.statusCode).json(publicErrorObject);
}

const controller = {
  errorHandlers: {
    onError,
    onNoMatch,
  },
};
export default controller;
