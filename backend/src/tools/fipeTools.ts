import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { FipeAPI } from "../api/fipe";
import { stringify } from "../utils/stringify";
import { slicer } from "../utils/slicer";

export const getMarcasTool = tool(
	async ({
		vehicleType,
	}: {
		vehicleType: "carros" | "motos" | "caminhoes";
	}) => {
		const result = await FipeAPI.getMarcas(vehicleType);
		return stringify(slicer(result, 100));
	},
	{
		name: "getMarcas",
		description:
			"FIRST STEP - Gets vehicle brands. REQUIRES: vehicleType from user. OUTPUT: List of brand IDs and names. MUST be used before any other tools. Vehicle type must be confirmed with user first.",
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
		const result = await FipeAPI.getModelos(vehicleType, marcaId);
		return stringify(slicer(result, 100));
	},
	{
		name: "getModelos",
		description:
			"SECOND STEP - Gets models for chosen brand. REQUIRES: marcaId EXACTLY as returned from getMarcas. NEVER use guessed IDs. Verify brand with user before proceeding.",
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
		const result = await FipeAPI.getAnos(vehicleType, marcaId, modeloId);
		return stringify(slicer(result, 100));
	},
	{
		name: "getAnos",
		description:
			"THIRD STEP - Gets production years for selected model. REQUIRES: modeloId from getModelos. MUST confirm model selection with user first. Year IDs often contain suffixes (e.g., '2023-1') - preserve exact format.",
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
		const result = await FipeAPI.getValor(
			vehicleType,
			marcaId,
			modeloId,
			ano
		);
		return stringify(slicer(result, 100));
	},
	{
		name: "getValor",
		description:
			"Fetch detailed price information for a specific vehicle configuration. Requires vehicle type, brand ID, model ID, and year identifier (e.g., '2014-3'). You need to get the anos before getting valor.",
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

// Export the tools as an array for easy binding with the language model.
export const fipeAPITools = [
	getMarcasTool,
	getModelosTool,
	getAnosTool,
	getValorTool,
];
