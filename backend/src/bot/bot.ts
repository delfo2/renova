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
import {
	AiMessageWithDate,
	HumanMessageWithDate,
	ToolMessageWithDate,
} from "./classes";

const toolsByName = {
	getMarcas: getMarcasTool,
	getModelos: getModelosTool,
	getAnos: getAnosTool,
	getValor: getValorTool,
};

export class Bot {
	public parser = new StringOutputParser();
	private model = new ChatOpenAI({
		model: "gpt-4o",
		apiKey: config.OPENAI_KEY,
	});
	private completeModel = this.model.bindTools(fipeAPITools);

	private system_rule = `
Você é um assistente especializado em consultas de preços de veículos na **Tabela FIPE** do Brasil. Seu papel é guiar o usuário passo a passo na obtenção de preços de **carros**, **motos** ou **caminhões**.

### **Como Funciona a Tabela FIPE?**
A API da FIPE segue um **processo sequencial** e depende de **códigos (IDs) únicos**. Para consultar um preço, siga esta ordem obrigatória:
1. **Escolha o tipo de veículo**: **"carros"**, **"motos"** ou **"caminhoes"**.
2. **Obtenha a lista de marcas** desse tipo de veículo. **Cada marca tem um código único**.
3. **Obtenha a lista de modelos** de uma marca. Para isso, é necessário o código da marca.
4. **Obtenha os anos disponíveis** para um modelo. Para isso, é necessário o código do modelo.
5. **Obtenha o preço FIPE** com base no código do ano, do modelo e da marca.

### **Regra Fundamental: Sempre Exibir os Códigos na Resposta**
- Quando apresentar marcas, modelos ou anos para o usuário, **sempre inclua o código (ID) no formato '[ID] Nome'**. Inclusive aplique o mesmo para anos, pois são IDs únicos. Exemplo: "2022-1".
- Isso é essencial porque **a IA não mantém a resposta da API na memória**. O usuário precisa escolher um código **exatamente como mostrado na resposta**.

### **Fluxo de Interação**
1. Se o usuário não especificar o tipo de veículo, pergunte primeiro.
2. Consulte a API para obter a lista de marcas e exiba os resultados **com os códigos**.
3. Quando o usuário escolher uma marca, consulte a API para obter os modelos e exiba os resultados **com os códigos**.
4. Quando o usuário escolher um modelo, consulte a API para obter os anos e exiba os resultados **com os códigos**.
5. Quando o usuário escolher um ano, consulte a API para obter o preço e exiba os detalhes.

### **Sobre**
1. Este modelo de IA foi projetado para auxiliar apenas nos preços dos veículos brasileiros
2. Foi construído como solução de desafio interno da Alpha EdTech para munchies/plati.ia
3. Fonte: Este modelo de IA utiliza a API FIPE para preços de veículos brasileiros por deividfortuna

Se a API não retornar resultados, informe o usuário e sugira tentar outros parâmetros.

A **Tabela FIPE** é a única fonte dos dados, e todos os preços vêm diretamente dessa base.
	`;

	public async process(
		message: string,
		...previousMessages: Array<SystemMessage | HumanMessage>
	): Promise<
		Array<HumanMessageWithDate | ToolMessageWithDate | AiMessageWithDate>
	> {
		const start = Date.now();
		console.log(".......................");
		console.log("Iniciando requisição...");

		console.log();
		console.log("[previousMessages]");
		console.log(previousMessages);
		console.log();
		console.log();

		const messages = [
			new SystemMessage(this.system_rule),
			...previousMessages,
			new HumanMessage(message),
		];
		const newMessages: Array<
			HumanMessageWithDate | ToolMessageWithDate | AiMessageWithDate
		> = [];

		console.log();
		console.log("[messages]");
		console.log(messages);
		console.log();
		console.log();

		console.log("-first OpenAI prompt-");
		const creationOfAiMessage = new Date();
		let aiMessage = await this.completeModel.invoke(messages);
		newMessages.push(
			new AiMessageWithDate(creationOfAiMessage, new Date(), aiMessage)
		);
		messages.push(aiMessage);
		console.log("-first OpenAI prompt complete-");

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
					const creationOfAiMessage = new Date();
					const toolMessage = await selectedTool.invoke(toolCall);
					console.log();
					console.log();
					console.log("[toolMessage from tool invocation]");
					console.log(toolMessage);
					console.log();
					console.log();
					messages.push(toolMessage);
					newMessages.push(
						new ToolMessageWithDate(
							creationOfAiMessage,
							new Date(),
							toolMessage
						)
					);
				}
			}

			const creationOfAiMessage = new Date();
			aiMessage = await this.completeModel.invoke(messages);
			console.log();
			console.log();
			console.log("[aiMessage consuming ai tool response]");
			console.log(aiMessage);
			console.log();
			messages.push(aiMessage);
			newMessages.push(
				new AiMessageWithDate(
					creationOfAiMessage,
					new Date(),
					aiMessage
				)
			);
		}
		console.log();
		console.log(
			"Requisição finalizada. Tempo de duração: " +
				(Date.now() - start) +
				"ms"
		);
		console.log(".......................");
		console.log();
		console.log();
		console.log();
		return newMessages;
	}
}
