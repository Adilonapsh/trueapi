import express, {
    Application,
    Express,
    Request,
    response,
    Response,
} from "express";
import dotenv from "dotenv";
import { router } from "./router/router";

dotenv.config();

const app: Application = express();

const appName: string = process.env.APP_NAME || "True API";
const port = process.env?.PORT;

app.use(router);

app.listen(port, () => {
    console.log(appName + " listening on port " + port);
});
