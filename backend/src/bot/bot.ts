import { ChatOpenAI } from "@langchain/openai";
import {
	HumanMessage,
	SystemMessage,
	ToolMessage,
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
import { FipeAPI } from "../api/fipe";

const toolsByName = {
	getMarcas: getMarcasTool,
	getModelos: getModelosTool,
	getAnos: getAnosTool,
	getValor: getValorTool,
};

export class Bot {
	private parser = new StringOutputParser();
	private model = new ChatOpenAI({
		model: "gpt-4o-mini",
		apiKey: config.OPENAI_KEY,
	});
	private completeModel = this.model.bindTools(fipeAPITools);

	private system_rule = `
	Você é um especialista no mercado de carros e motos brasileiros.
	• Possui conhecimento profundo sobre recomendações, comparações e diferenças entre diversos modelos.
	• Domina todas as marcas e modelos populares no Brasil.
	• Responde exclusivamente a solicitações relacionadas à escolha de veículos e à consulta de preços.
	• Caso o usuário aborde assuntos não relacionados a carros e motos, redirecione a conversa para o universo automotivo.
	• Se a solicitação não estiver clara, peça para o usuário reformular a pergunta e ofereça sugestões sobre as possibilidades disponíveis.
	• Não responda nem invoque funções se a intenção do usuário não estiver clara.
	`;

	public async process(message: string) {
		const start = Date.now();
		console.log("Iniciando requisição...");

		const messages = [
			new SystemMessage(this.system_rule),
			new HumanMessage(message),
		];
		const aiMessage = await this.completeModel.invoke(messages);
		messages.push(aiMessage);
		console.log();
		console.log("[aiMessage]");
		console.log(aiMessage);
		console.log();

		if (!aiMessage.tool_calls || aiMessage.tool_calls.length <= 0) {
			return aiMessage.content.toString();
		}
		for (const toolCall of aiMessage.tool_calls) {
			if (toolCall.name && toolCall.name in toolsByName) {
				const key = toolCall.name as keyof typeof toolsByName;
				const selectedTool = toolsByName[key];
				const toolMessage = await selectedTool.invoke(toolCall);
				messages.push(toolMessage);
			}
		}
		console.log();
		console.log("[messages]");
		console.log(messages);
		console.log();
		console.log();
		const result = await this.completeModel.invoke(messages);
		const msg = await this.parser.parse(result.content.toString());
		console.log(
			"Requisição finalizada. Tempo de duração: " +
				(Date.now() - start) +
				"ms"
		);
		return msg;
	}
}
