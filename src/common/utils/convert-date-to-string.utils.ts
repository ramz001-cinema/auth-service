export const convertDateToString = (date?: Date | null): string | undefined => {
	if (!date) return undefined
	return date.toISOString()
}
