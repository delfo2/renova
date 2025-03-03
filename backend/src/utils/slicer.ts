export const slicer = (obj: { [key: string]: any }, maxLength: number) => {
	for (const key in obj) {
		if (obj[key].length > maxLength) {
			obj[key] = obj[key].slice(0, maxLength);
			console.log(`(slicer) ${key} was sliced`);
		}
	}
	return obj;
};
