import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import router from "./routes";
import { limiter } from "./helpers/limiter.helper";

import swaggerUi from "swagger-ui-express";
import swaggerDocument from "swagger-jsdoc";
dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors());

app.use(limiter);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api/v1", router);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}/api/v1/`);
});
