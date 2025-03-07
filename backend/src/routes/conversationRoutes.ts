import express, { Router } from "express";
import ConversationController from "../controllers/conversationController";

const conversationRoutes: Router = express.Router();
const conversationController = new ConversationController();

conversationRoutes.post("/", (req, res) =>
	conversationController.createConversation(req, res)
);
conversationRoutes.get("/", (req, res) =>
	conversationController.findConversations(req, res)
);

conversationRoutes.delete("/:id", (req, res) =>
	conversationController.deleteConversation(req, res)
);

export default conversationRoutes;
