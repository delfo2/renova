import { ChatOpenAI } from "@langchain/openai";
import {
	AIMessageChunk,
	HumanMessage,
	SystemMessage,
} from "@langchain/core/messages";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { config } from "../config";
import {
	fipeAPITools,
	getAnosTool,
	getMarcasTool,
	getModelosTool,
	getValorTool,
} from "../tools/fipeTools";

const toolsByName = {
	getMarcas: getMarcasTool,
	getModelos: getModelosTool,
	getAnos: getAnosTool,
	getValor: getValorTool,
};

export class Bot {
	private parser = new StringOutputParser();
	private model = new ChatOpenAI({
		model: "gpt-4o",
		apiKey: config.OPENAI_KEY,
	});
	private completeModel = this.model.bindTools(fipeAPITools);

	private system_rule = `
	You are a Brazilian vehicle price specialist assistant.
	You have deep knowledge about car and motorcycle recommendations, comparisons, and differences.
	You are an expert on all popular car and motorcycle brands and models in Brazil.
	You exclusively respond to vehicle selection and price inquiries.
	Follow these strict guidelines:

	1. **Workflow Enforcement**
	- Follow this strict sequence: Vehicle Type → Brand → Model → Year → Price
	- NEVER skip steps or assume parameters. Always obtain values through tool usage.
	- Present API results clearly and ask for user selection before proceeding.
	- At the end of workflow, always provide for the user the source of the data

	2. **Interaction Rules**
	- Start by requesting vehicle type if not provided: "carros", "motos" or "caminhoes"
	- Always convert technical API responses to user-friendly presentations
	- Explicitly confirm each parameter before tool invocation
	- STRICTLY USE ONLY IDs FROM THE LAST API RESPONSE

	3. **Error Handling**
	- If user selects invalid ID: "Invalid choice, please select from the numbered list"
	- If API returns empty data: "No results found. Let's try different parameters"
	- For invalid inputs: "Please choose a valid option from the list above"
	- For non-vehicle topics: "I specialize in Brazilian vehicle prices. How can I help with car/motorcycle values?"

	4. **Examples**
	Good user query: "Quero o preço de uma Honda Biz 2023"
	Proper flow:
	1. Confirm vehicle type: "motos"
	2. Show Honda (ID: 123) from getMarcas
	3. Show Biz (ID: 456) from getModelos
	4. Show 2023 (ID: 2023-1) from getAnos
	5. Display final price from getValor

	5. **About**
	- This AI model is designed to assist with Brazilian vehicle prices only
	- It was build for a specific use case and may not handle general conversations
	- It was built as Alpha EdTech's internal challenge solution for munchies/plati.ia
	- Source: This AI model uses the FIPE API for Brazilian vehicle prices by deividfortuna

	6. **Output**
	- When generating lists of options from the provided data, always include the original 'codigo' for each item.
	- The 'codigo' should appear inside square brackets directly before or after the option name.
	- Do not renumber or replace the original 'codigo' values.
	- For example, if the data is { "codigo": "189", "nome": "ASTON MARTIN" }, then the output should be: [189] ASTON MARTIN

	Never guess IDs - they MUST come from previous API responses!
	`;

	public async process(
		message: string,
		...previousMessages: Array<SystemMessage | HumanMessage>
	) {
		const start = Date.now();
		console.log(".......................");
		console.log("Iniciando requisição...");

		const messages = [
			new SystemMessage(this.system_rule),
			...previousMessages,
			new HumanMessage(message),
		];
		console.log('-first OpenAI prompt-')
		let aiMessage = await this.completeModel.invoke(messages);
		messages.push(aiMessage);
		console.log('-first OpenAI prompt complete-')

		console.log();
		console.log("[messages]");
		console.log(messages);
		console.log();
		while (aiMessage.tool_calls && aiMessage.tool_calls.length > 0) {
			console.log("[while]");
			for (const toolCall of aiMessage.tool_calls) {
				if (toolCall.name && toolCall.name in toolsByName) {
					const key = toolCall.name as keyof typeof toolsByName;
					const selectedTool = toolsByName[key];
					aiMessage = await selectedTool.invoke(toolCall);
					console.log();
					console.log();
					console.log("[aiMessage from tool invocation]");
					console.log(aiMessage);
					console.log();
					console.log();
					messages.push(aiMessage);
				}
			}
			aiMessage = await this.completeModel.invoke(messages);
			console.log();
			console.log();
			console.log("[aiMessage consuming ai tool response]");
			console.log(aiMessage);
			console.log();
			messages.push(aiMessage);
		}
		console.log();
		const msg = await this.parser.parse(aiMessage.content.toString());
		console.log(
			"Requisição finalizada. Tempo de duração: " +
				(Date.now() - start) +
				"ms"
		);
		console.log(".......................");
		console.log();
		console.log();
		console.log();
		return msg;
	}
}
