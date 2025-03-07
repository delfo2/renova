import { AIMessage, HumanMessage, ToolMessage } from "@langchain/core/messages";
import { Speaker } from "@prisma/client";
import { Request, Response } from "express";
import prisma from "../database/prisma";
import { MessageService } from "../services/messageService";
import { Exception } from "../utils/Exception";
import { Bot } from "../bot/bot";
import checkIfItsUUID from "../validations/checkIfUUIDIsValid";
import checkIfItsValidString from "../validations/checkIfStringValid";

export default class MessageController {
	private messageService = new MessageService(prisma);
	private bot = new Bot();

	async create(req: Request, res: Response) {
		const { conversationID } = req.params;
		const { content } = req.body;

		try {
			checkIfItsUUID(conversationID);
			checkIfItsValidString(content);

			const previousMessages = await this.messageService.findMessages(
				conversationID
			);
			const formattedMessages = previousMessages.map((message) => {
				if (message.speaker === Speaker.USER) {
					return new HumanMessage(message.content);
				} else if (message.speaker === Speaker.BOT) {
					return new AIMessage({
						content: message.content,
						tool_calls: JSON.parse(message.tool_calls ?? "null"),
					});
				}
				const toolMessage = JSON.parse(message.content);
				return new ToolMessage({
					content: toolMessage.content,
					name: toolMessage.name,
					additional_kwargs: toolMessage.additional_kwargs,
					response_metadata: toolMessage.response_metadata,
					tool_call_id: toolMessage.tool_call_id,
				});
			});
			await this.messageService.createMessages(
				conversationID,
				content,
				Speaker.USER,
				new Date(),
				new Date()
			);
			const dateBeforeBotProcess = new Date();
			const msgs = await this.bot.process(content, ...formattedMessages);

			const prismaMsg = [];
			for (const element of msgs) {
				if (element instanceof ToolMessage) {
					const cont = {
						content: element.content,
						name: element.name,
						additional_kwargs: element.additional_kwargs,
						response_metadata: element.response_metadata,
						tool_call_id: element.tool_call_id,
					};
					console.log("inserting tool message");
					await this.messageService.createMessages(
						conversationID,
						JSON.stringify(cont),
						Speaker.TOOL,
						dateBeforeBotProcess,
						new Date()
					);
				} else {
					const cont = await this.bot.parser.parse(
						element.content.toString()
					);
					const toolCalls = element.tool_calls;
					const toolCallsString =
						toolCalls && toolCalls.length > 0
							? JSON.stringify(toolCalls)
							: null;
					prismaMsg.push(
						await this.messageService.createMessages(
							conversationID,
							cont,
							Speaker.BOT,
							dateBeforeBotProcess,
							new Date(),
							toolCallsString
						)
					);
				}
			}
			res.status(201).json(prismaMsg[prismaMsg.length - 1]);
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
		const { conversationID } = req.params;
		try {
			checkIfItsUUID(conversationID);
			const messages = await this.messageService.findMessages(
				conversationID
			);
			const filteredMessages = messages.filter(
				(m) =>
					m.speaker === Speaker.USER ||
					(m.speaker === Speaker.BOT && !m.tool_calls)
			);
			res.status(200).json(filteredMessages);
		} catch (error) {
			if (error instanceof Exception) {
				res.status(error.statusCode).json({ error: error.message });
			} else {
				res.status(500).json({ error: "Internal Server Error" });
			}
		}
	}
}
