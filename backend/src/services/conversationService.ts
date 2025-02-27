import { PrismaClient } from "@prisma/client";

export class ConversationService {
	constructor(private readonly prismaService: PrismaClient) {}
	public async createConversation() {
		return await this.prismaService.conversation.create({ data: {} });
	}

	public async findConversations() {
		return await this.prismaService.conversation.findMany();
	}
}
