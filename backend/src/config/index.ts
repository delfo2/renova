import * as dotenv from "dotenv";
dotenv.config();

export const config = {
	PORT: process.env.PORT ?? 3000,
	OPENAI_KEY: process.env.OPENAI_KEY ?? "",
	DATABASE_URL: process.env.DATABASE_URL ?? "",
};

for (const key in config) {
	if (!process.env[key]) {
		console.log(
			`[${key}] is expected in .env file, but was not provided. Please fullfil your .env according .env.example.`
		);
	}
}
