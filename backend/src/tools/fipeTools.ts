import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { FipeAPI } from "../api/fipe";
import { stringify } from "../utils/stringify";
import { slicer } from "../utils/slicer";

const handleAPIError = (error: unknown, context: string) => {
	if (error instanceof Error) {
		if (error.message.toLowerCase().includes("not found")) {
			return `Error: ${context} not found. Please check the provided identifiers.`;
		}
		if (error.message.toLowerCase().includes("bad request")) {
			return `Error: Invalid arguments for ${context}.`;
		}
		return `Error: Failed to fetch ${context} - ${error.message}`;
	}
	return `Error: An unexpected error occurred during ${context} fetch.`;
};

export const getMarcasTool = tool(
	async ({
		vehicleType,
	}: {
		vehicleType: "carros" | "motos" | "caminhoes";
	}) => {
		try {
			const result = await FipeAPI.getMarcas(vehicleType);
			return stringify(slicer(result, 100));
		} catch (error) {
			return handleAPIError(error, "vehicle brands");
		}
	},
	{
		name: "getMarcas",
		description:
			"FIRST STEP - Gets vehicle brands. REQUIRES: vehicleType from user. OUTPUT: List of brand IDs and names. {codigo: string, nome: string} where 'codigo' is the ID of the brand. MUST be used before any other tools. Vehicle type must be confirmed with user first.",
		schema: z.object({
			vehicleType: z
				.enum(["carros", "motos", "caminhoes"])
				.describe(
					"The type of vehicle. Valid values: 'carros', 'motos', 'caminhoes'."
				),
		}),
	}
);

export const getModelosTool = tool(
	async ({
		vehicleType,
		marcaId,
	}: {
		vehicleType: "carros" | "motos" | "caminhoes";
		marcaId: string;
	}) => {
		try {
			const result = await FipeAPI.getModelos(vehicleType, marcaId);
			return stringify(slicer(result, 100));
		} catch (error) {
			return handleAPIError(error, "models");
		}
	},
	{
		name: "getModelos",
		description:
			"SECOND STEP - Gets models for chosen brand. REQUIRES: marcaId EXACTLY as returned from getMarcas. NEVER use guessed IDs. Verify brand with user before proceeding. OUTPUT is a list of model IDs and names. {codigo: string, nome: string} where 'codigo' is the ID of the model.",
		schema: z.object({
			vehicleType: z
				.enum(["carros", "motos", "caminhoes"])
				.describe(
					"The type of vehicle. Valid values: 'carros', 'motos', 'caminhoes'."
				),
			marcaId: z
				.string()
				.describe(
					"The brand ID as returned from the getMarcas endpoint. NEVER use guessed IDs."
				),
		}),
	}
);

export const getAnosTool = tool(
	async ({
		vehicleType,
		marcaId,
		modeloId,
	}: {
		vehicleType: "carros" | "motos" | "caminhoes";
		marcaId: string;
		modeloId: string;
	}) => {
		try {
			const result = await FipeAPI.getAnos(
				vehicleType,
				marcaId,
				modeloId
			);
			return stringify(slicer(result, 100));
		} catch (error) {
			return handleAPIError(error, "production years");
		}
	},
	{
		name: "getAnos",
		description:
			"THIRD STEP - Gets production years for selected model. REQUIRES: modeloId from getModelos. MUST confirm model selection with user first. Year IDs often contain suffixes (e.g., '2023-1') - preserve exact format. OUTPUT is a list of year IDs and names. {codigo: string, nome: string} where 'codigo' is the ID of the year.",
		schema: z.object({
			vehicleType: z
				.enum(["carros", "motos", "caminhoes"])
				.describe(
					"The type of vehicle. Valid values: 'carros', 'motos', 'caminhoes'."
				),
			marcaId: z
				.string()
				.regex(/\d+/)
				.describe(
					"The brand ID (numeric) as returned from the getMarcas endpoint. NEVER use guessed IDs."
				),
			modeloId: z
				.string()
				.regex(/\d+/)
				.describe(
					"The model ID (numeric) as returned from the getModelos endpoint. NEVER use guessed IDs."
				),
		}),
	}
);

export const getValorTool = tool(
	async ({
		vehicleType,
		marcaId,
		modeloId,
		ano,
	}: {
		vehicleType: "carros" | "motos" | "caminhoes";
		marcaId: string;
		modeloId: string;
		ano: string;
	}) => {
		try {
			const result = await FipeAPI.getValor(
				vehicleType,
				marcaId,
				modeloId,
				ano
			);
			return stringify(slicer(result, 100));
		} catch (error) {
			return handleAPIError(error, "price information");
		}
	},
	{
		name: "getValor",
		description:
			"LAST STEP - Fetch detailed price information for a specific vehicle configuration. Requires vehicle type, brand ID, model ID, and year identifier (e.g., '2014-3'). You need to get the anos before getting valor. OUTPUT is a detailed price information object.",
		schema: z.object({
			vehicleType: z
				.enum(["carros", "motos", "caminhoes"])
				.describe(
					"The type of vehicle. Valid values: 'carros', 'motos', 'caminhoes'."
				),
			marcaId: z
				.string()
				.describe(
					"The brand ID as returned from the getMarcas endpoint. NEVER use guessed IDs."
				),
			modeloId: z
				.string()
				.describe(
					"The model ID as returned from the getModelos endpoint. NEVER use guessed IDs."
				),
			ano: z
				.string()
				.describe(
					"The year configuration identifier (e.g., '2014-3'). NEVER use guessed IDs."
				),
		}),
	}
);

export const fipeAPITools = [
	getMarcasTool,
	getModelosTool,
	getAnosTool,
	getValorTool,
];
