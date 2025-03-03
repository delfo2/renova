import express, { Router } from "express";
import MessageController from "../controllers/messageController";

const messageRoutes: Router = express.Router();
const messageController = new MessageController();

messageRoutes.post("/:conversationID", (req, res) =>
	messageController.create(req, res)
);
messageRoutes.get("/:conversationID", (req, res) =>
	messageController.getAll(req, res)
);

export default messageRoutes;
