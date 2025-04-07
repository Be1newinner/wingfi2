import { Response } from "express";

// enum status {
//   success = "success",
//   error = "error",
// }

type JSONResponseType = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  meta?: any;
  status_code?: number;
  application_code?: number;
  message?: string;
  status?: "success" | "error";
};

function JSONResponse({
  data = null,
  meta = {},
  status_code = 200,
  application_code,
  message = "Operation success!",
  status = "success",
}: JSONResponseType) {
  return {
    data,
    meta,
    status_code,
    application_code: application_code || status_code,
    message,
    status,
  };
}

export function SendResponse(resObject: Response, response: JSONResponseType) {
  const res = JSONResponse(response);
  resObject.status(res.status_code).json(res);
}
