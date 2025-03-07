import { AIMessage, HumanMessage, ToolMessage } from "@langchain/core/messages";

abstract class ImplementAiDate {
	public abstract createdAt: Date;
	public abstract completedAt: Date;
}

export class HumanMessageWithDate implements ImplementAiDate {
	constructor(
		public createdAt: Date,
		public completedAt: Date,
		public humanMessage: HumanMessage
	) {}
}

export class ToolMessageWithDate implements ImplementAiDate {
	constructor(
		public createdAt: Date,
		public completedAt: Date,
		public toolMessage: ToolMessage
	) {}
}

export class AiMessageWithDate implements ImplementAiDate {
	constructor(
		public createdAt: Date,
		public completedAt: Date,
		public aiMessage: AIMessage
	) {}
}
