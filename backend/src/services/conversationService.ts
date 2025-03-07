import { PrismaClient } from "@prisma/client";
import { BadRequestException, Exception } from "../utils/Exception";
import { ERROR_MESSAGES } from "../utils/Message";

export class ConversationService {
	constructor(private readonly prismaService: PrismaClient) {}
	public async createConversation() {
		return await this.prismaService.conversation.create({ data: {} });
	}

	public async findConversations() {
		return await this.prismaService.conversation.findMany();
	}

	public async deleteConversation(id: string) {
		const conversation = await this.prismaService.conversation.findFirst({
			where: { id },
		});
		if (!conversation) {
			throw new BadRequestException(
				ERROR_MESSAGES.INVALID_CONVERSATION_ID
			);
		}
		return await this.prismaService.$transaction(async (prisma) => {
			await prisma.message.deleteMany({ where: { conversationId: id } });
			return await prisma.conversation.delete({ where: { id } });
		});
	}
}
