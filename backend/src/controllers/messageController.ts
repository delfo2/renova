import { Request, Response } from "express";
import prisma from "../database/prisma";
import { MessageService } from "../services/messageService";
import { v4 as uuidv4, validate as uuidValidate } from "uuid";
import { Speaker } from "@prisma/client";
import { BadRequestException, Exception } from "../utils/Exception";
import { ERROR_MESSAGES } from "../utils/Message";
import { Bot } from "../bot/bot";

export default class MessageController {
	private messageService = new MessageService(prisma);
	private bot = new Bot();

	async create(req: Request, res: Response) {
		try {
			const { conversationID } = req.params;
			const { content } = req.body;

			this.checkIfItsUUID(conversationID);
			this.checkIfItsValidString(content);

			await this.messageService.createMessages(
				conversationID,
				content,
				Speaker.USER
			);
			const resBot = await this.bot.process(content);
			await this.messageService.createMessages(
				conversationID,
				resBot,
				Speaker.BOT
			);
			res.status(201).json(resBot);
		} catch (error) {
			if (error instanceof Exception) {
				res.status(error.statusCode).json({ error: error.message });
			} else {
				console.log(error);
				res.status(500).json({ error: "Internal Server Error" });
			}
		}
	}

	async getAll(req: Request, res: Response) {
		try {
			const { conversationID } = req.params;
			this.checkIfItsUUID(conversationID);
			const messages = await this.messageService.findMessages(
				conversationID
			);
			res.status(200).json(messages);
		} catch (error) {
			if (error instanceof Exception) {
				res.status(error.statusCode).json({ error: error.message });
			} else {
				res.status(500).json({ error: "Internal Server Error" });
			}
		}
	}

	private checkIfItsUUID(uuid: string) {
		if (!uuid || typeof uuid !== "string" || !uuidValidate(uuid)) {
			throw new BadRequestException(ERROR_MESSAGES.INVALID_UUID);
		}
		return true;
	}

	private checkIfItsValidString(content: string) {
		if (
			!content ||
			typeof content !== "string" ||
			!/^[\w\s.,!?(){}\[\]$+\-*/=À-ú]+$/.test(content)
		) {
			throw new BadRequestException(
				ERROR_MESSAGES.INVALID_MESSAGE_CONTENT
			);
		}
		return true;
	}
}
