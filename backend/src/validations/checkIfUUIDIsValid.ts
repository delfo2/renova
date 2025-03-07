import { v4 as uuidv4, validate as uuidValidate } from "uuid";
import { BadRequestException } from "../utils/Exception";
import { ERROR_MESSAGES } from "../utils/Message";

export default function checkIfItsUUID(uuid: string) {
	if (!uuid || typeof uuid !== "string" || !uuidValidate(uuid)) {
		throw new BadRequestException(ERROR_MESSAGES.INVALID_UUID);
	}
	return true;
}
