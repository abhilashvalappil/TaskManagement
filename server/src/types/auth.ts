 

import { Request } from "express";

export interface JwtUserPayload {
  userId: string;
}

export interface AuthRequest extends Request {
  user?: JwtUserPayload;
}
