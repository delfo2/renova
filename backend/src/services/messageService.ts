import { PrismaClient, Speaker } from "@prisma/client";

export class MessageService {
	constructor(private readonly prismaService: PrismaClient) {}

	async findMessages(conversationID: string) {
		return await this.prismaService.message.findMany({
			where: { conversationId: conversationID },
		});
	}

	async createMessages(
		conversationID: string,
		content: string,
		speaker: Speaker
	) {
		return await this.prismaService.message.create({
			data: {
				content,
				conversationId: conversationID,
				speaker: speaker,
			},
		});
	}
}
