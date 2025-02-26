import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { config } from "../config";

export class Bot {
	private parser = new StringOutputParser();
	private model = new ChatOpenAI({
		model: "gpt-4o-mini",
		apiKey: config.OPENAI_KEY,
	});

	private system_rule = ``;
}
