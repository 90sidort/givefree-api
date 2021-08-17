import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

interface RequestAuth extends Request {
  isAuth?: boolean;
  userId?: number;
}

export const isAuth = (
  req: RequestAuth,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    req.isAuth = false;
    return next();
  }
  const token = authHeader.split(" ")[1];
  if (!token || token === "") {
    req.isAuth = false;
    return next();
  }
  let decodedToken;
  try {
    decodedToken = <any>jwt.verify(token, "super_secret_821378");
  } catch (e) {
    req.isAuth = false;
    return next();
  }
  if (!decodedToken) {
    req.isAuth = false;
    return next();
  }
  req.isAuth = true;
  req.userId = decodedToken.userId;
  return next();
};
