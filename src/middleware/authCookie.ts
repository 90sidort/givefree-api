import * as jwt from "jsonwebtoken";

export const isAuth = (req, _, next) => {
  const token = req.cookies["token"];
  let data;
  try {
    data = jwt.verify(token, process.env.SECRET as string) as any;
  } catch {
    req.isAuth = false;
    return next();
  }
  if (!data) {
    req.isAuth = false;
    return next();
  }
  req.isAuth = true;
  req.userId = data.userId;
  req.username = data.username;
  next();
};
