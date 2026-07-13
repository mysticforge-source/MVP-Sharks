/**
 * For specific response-like logic functions
 */
export type Result<T> = {
	success: boolean;
	msg?: string;
	data: T;
};

// some type shortcuts
export type table = {
	[k: string]: any;
};
export type func<R = void> = (...args: any[]) => R;
