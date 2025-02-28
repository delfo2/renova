import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { FipeAPI } from "../api/fipe";

export const getMarcasTool = tool(
	async ({
		vehicleType,
	}: {
		vehicleType: "carros" | "motos" | "caminhoes";
	}) => {
		const result = await FipeAPI.getMarcas(vehicleType);
		return JSON.stringify(result);
	},
	{
		name: "getMarcas",
		description:
			"Fetch the list of vehicle brands for a given vehicle type. Valid vehicle types: 'carros', 'motos', or 'caminhoes'.",
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
		return JSON.stringify(result);
	},
	{
		name: "getModelos",
		description:
			"Fetch the list of vehicle models for a specific brand. Requires the vehicle type and brand ID. You need to get the marcas before getting modelos.",
		schema: z.object({
			vehicleType: z
				.enum(["carros", "motos", "caminhoes"])
				.describe(
					"The type of vehicle. Valid values: 'carros', 'motos', 'caminhoes'."
				),
			marcaId: z
				.string()
				.describe(
					"The brand ID as returned from the getMarcas endpoint. YOU CANNOT GENERATE THIS VALUE, ITS A CODE."
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
		return JSON.stringify(result);
	},
	{
		name: "getAnos",
		description:
			"Fetch the list of available years for a specific vehicle model. Requires vehicle type, brand ID, and model ID. You need to get the modelos before getting anos.",
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
					"The brand ID (numeric) as returned from the getMarcas endpoint. YOU CANNOT GENERATE THIS VALUE, ITS A CODE."
				),
			modeloId: z
				.string()
				.regex(/\d+/)
				.describe(
					"The model ID (numeric) as returned from the getModelos endpoint. YOU CANNOT GENERATE THIS VALUE, ITS A CODE."
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
		return JSON.stringify(result);
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
					"The brand ID as returned from the getMarcas endpoint. YOU CANNOT GENERATE THIS VALUE, ITS A CODE."
				),
			modeloId: z
				.string()
				.describe(
					"The model ID as returned from the getModelos endpoint. YOU CANNOT GENERATE THIS VALUE, ITS A CODE."
				),
			ano: z
				.string()
				.describe(
					"The year configuration identifier (e.g., '2014-3'). YOU CANNOT GENERATE THIS VALUE, ITS A CODE."
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
