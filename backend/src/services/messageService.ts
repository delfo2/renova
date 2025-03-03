import { PrismaClient, Speaker } from "@prisma/client";
import { BadRequestException } from "../utils/Exception";
import { ERROR_MESSAGES } from "../utils/Message";

export class MessageService {
	constructor(private readonly prismaService: PrismaClient) {}

	async findMessages(conversationID: string) {
		await this.checkIfExists(conversationID);
		return await this.prismaService.message.findMany({
			where: { conversationId: conversationID },
		});
	}

	async createMessages(
		conversationID: string,
		content: string,
		speaker: Speaker
	) {
		await this.checkIfExists(conversationID);
		return await this.prismaService.message.create({
			data: {
				content,
				conversationId: conversationID,
				speaker: speaker,
			},
		});
	}

	private async checkIfExists(conversationID: string) {
		const conversation = await this.prismaService.conversation.findFirst({
			where: { id: conversationID },
		});
		if (!conversation) {
			throw new BadRequestException(
				ERROR_MESSAGES.INVALID_CONVERSATION_ID
			);
		}
		return true;
	}
}
