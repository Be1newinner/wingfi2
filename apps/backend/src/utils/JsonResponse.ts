import { Response } from "express";

type JSONResponseType = {
  // we will come to it later!
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  // we will come to it later!
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  meta?: any;
  status_code?: number;
  application_code?: number;
  message?: string;
};

function JSONResponse({
  data = null,
  meta = {},
  status_code = 200,
  application_code,
  message = "Operation success!",
}: JSONResponseType) {
  return {
    data,
    meta,
    status_code,
    application_code: application_code || status_code,
    message,
  };
}

export function SendResponse(resObject: Response, response: JSONResponseType) {
  const res = JSONResponse(response);
  resObject.status(res.status_code).json(res);
}
