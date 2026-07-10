export type Result<T> = {
	success: boolean;
	msg?: string;
	data: T;
};
