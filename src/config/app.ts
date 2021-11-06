import * as express from "express";
import * as cookieParser from "cookie-parser";
import { isAuth } from "../middleware/authCookie";

const app = express();
app.use(cookieParser());
app.use(isAuth);
app.use(express.static("images"));

export default app;
