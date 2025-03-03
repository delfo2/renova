export interface IMarca {
	codigo: string;
	nome: string;
}
export type IMarcas = IMarca[];

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

export interface IAno {
	codigo: string;
	nome: string;
}
export type IAnos = IAno[];

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

export type VehicleType = "carros" | "motos" | "caminhoes";

export class FipeAPI {
	private static readonly BASE_URL = "https://parallelum.com.br/fipe/api/v1";

	public static async getMarcas(vehicleType: VehicleType): Promise<IMarcas> {
		const response = await fetch(`${this.BASE_URL}/${vehicleType}/marcas`);
		if (!response.ok) {
			throw new Error(`Failed to fetch marcas: ${response.statusText}`);
		}
		const result = (await response.json()) as IMarcas;
		console.log("[result]");
		console.log(result);
		console.log();
		return result;
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
		const result = (await response.json()) as IModeloData;
		console.log("[result]");
		console.log(result);
		console.log();
		return result;
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
		const result = (await response.json()) as IAnos;
		console.log("[result]");
		console.log(result);
		console.log();
		return result;
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
		const result = (await response.json()) as IValor;
		console.log("[result]");
		console.log(result);
		console.log();
		return result;
	}
}
