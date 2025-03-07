import { PrismaClient, Speaker } from "@prisma/client";
import { BadRequestException } from "../utils/Exception";
import { ERROR_MESSAGES } from "../utils/Message";

export class MessageService {
	constructor(private readonly prismaService: PrismaClient) {}

	async findMessages(conversationID: string) {
		await this.checkIfExists(conversationID);
		return await this.prismaService.message.findMany({
			where: { conversationId: conversationID },
			orderBy: {
				createdAt: "asc",
			},
		});
	}

	async createMessages(
		conversationID: string,
		content: string,
		speaker: Speaker,
		createdAt: Date,
		completedAt: Date,
		tool_calls: string | null = null
	) {
		await this.checkIfExists(conversationID);
		return await this.prismaService.message.create({
			data: {
				content,
				conversationId: conversationID,
				speaker: speaker,
				tool_calls,
				createdAt,
				completedAt,
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
