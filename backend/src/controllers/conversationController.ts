import prisma from "../database/prisma";
import { ConversationService } from "../services/conversationService";
import { Request, Response } from "express";
import { Exception } from "../utils/Exception";
import checkIfItsUUID from "../validations/checkIfUUIDIsValid";

export default class ConversationController {
	private readonly conversationService = new ConversationService(prisma);

	public async createConversation(req: Request, res: Response) {
		try {
			const conversation =
				await this.conversationService.createConversation();
			res.json(conversation).status(201);
		} catch (error) {
			if (error instanceof Exception) {
				res.status(error.statusCode).json({ error: error.message });
			} else {
				res.status(500).json({ error: "Internal Server Error" });
			}
		}
	}

	public async findConversations(req: Request, res: Response) {
		try {
			const conversations =
				await this.conversationService.findConversations();
			res.json(conversations).status(200);
		} catch (error) {
			if (error instanceof Exception) {
				res.status(error.statusCode).json({ error: error.message });
			} else {
				res.status(500).json({ error: "Internal Server Error" });
			}
		}
	}

	public async deleteConversation(req: Request, res: Response) {
		const { id } = req.params;
		try {
			checkIfItsUUID(id);
			await this.conversationService.deleteConversation(id);
			res.status(200).end();
		} catch (error) {
			if (error instanceof Exception) {
				res.status(error.statusCode).json({ error: error.message });
			} else {
				res.status(500).json({ error: "Internal Server Error" });
			}
		}
	}
}
