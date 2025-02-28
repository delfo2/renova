// Interfaces representing the API responses

// Marcas endpoint returns an array of brands
export interface IMarca {
	codigo: string;
	nome: string;
}
export type IMarcas = IMarca[];

// The Modelos endpoint returns an object with two arrays:
// - modelos: list of vehicle models
// - anos: list of available year configurations for the models
export interface IModeloData {
	modelos: {
		codigo: number;
		nome: string;
	}[];
	anos: {
		codigo: string;
		nome: string;
	}[];
}

// The Anos endpoint returns an array of objects for each available year.
export interface IAno {
	codigo: string;
	nome: string;
}
export type IAnos = IAno[];

// The Valor endpoint returns details about the vehicle value.
export interface IValor {
	TipoVeiculo: number;
	Valor: string;
	Marca: string;
	Modelo: string;
	AnoModelo: number;
	Combustivel: string;
	CodigoFipe: string;
	MesReferencia: string;
	SiglaCombustivel: string;
}

// You can define a type for the vehicle type as follows:
export type VehicleType = "carros" | "motos" | "caminhoes";

// Static class that implements the API methods
export class FipeAPI {
	private static readonly BASE_URL = "https://parallelum.com.br/fipe/api/v1";

	public static async getMarcas(vehicleType: VehicleType): Promise<IMarcas> {
		const response = await fetch(`${this.BASE_URL}/${vehicleType}/marcas`);
		if (!response.ok) {
			throw new Error(`Failed to fetch marcas: ${response.statusText}`);
		}
		return await response.json();
	}

	public static async getModelos(
		vehicleType: VehicleType,
		marcaId: string
	): Promise<IModeloData> {
		const url = `${this.BASE_URL}/${vehicleType}/marcas/${marcaId}/modelos`;
		console.log("[url]");
		console.log(url);
		console.log();
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Failed to fetch modelos: ${response.statusText}`);
		}
		return await response.json();
	}

	public static async getAnos(
		vehicleType: VehicleType,
		marcaId: string,
		modeloId: string
	): Promise<IAnos> {
		const url = `${this.BASE_URL}/${vehicleType}/marcas/${marcaId}/modelos/${modeloId}/anos`;
		console.log("[url]");
		console.log(url);
		console.log();
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Failed to fetch anos: ${response.statusText}`);
		}
		return await response.json();
	}

	public static async getValor(
		vehicleType: VehicleType,
		marcaId: string,
		modeloId: string,
		ano: string
	): Promise<IValor> {
		const url = `${this.BASE_URL}/${vehicleType}/marcas/${marcaId}/modelos/${modeloId}/anos/${ano}`;
		console.log("[url]");
		console.log(url);
		console.log();
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Failed to fetch valor: ${response.statusText}`);
		}
		return await response.json();
	}
}
