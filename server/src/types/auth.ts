// import { Request } from "express";
// import { JwtPayload } from "jsonwebtoken";

// export interface AuthRequest extends Request {
//   user?: string | JwtPayload;
// }

import { Request } from "express";

export interface JwtUserPayload {
  userId: string;
}

export interface AuthRequest extends Request {
  user?: JwtUserPayload;
}
