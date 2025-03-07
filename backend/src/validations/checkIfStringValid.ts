import { BadRequestException } from "../utils/Exception";
import { ERROR_MESSAGES } from "../utils/Message";

export default function checkIfItsValidString(content: string) {
	if (
		!content ||
		typeof content !== "string" ||
		!/^[\w\s.,!?(){}\[\]$+\-*/=À-ú]+$/.test(content)
	) {
		throw new BadRequestException(ERROR_MESSAGES.INVALID_MESSAGE_CONTENT);
	}
	return true;
}
