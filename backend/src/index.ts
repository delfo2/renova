import express, { Express } from "express";
import { config } from "./config/index";
import { router } from "./routes/router";
import http from "http";
import cors from "cors";

const app: Express = express();
app.use(express.json());
app.use(
	cors({
		origin: "*",
		optionsSuccessStatus: 200,
		credentials: true,
	})
);
app.use("/api", router);

const server = http.createServer(app);
server.listen(config.PORT, () => {
	console.log(`server running at port ${config.PORT}!`);
});
