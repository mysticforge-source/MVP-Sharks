/** UDim and UDim2 scale wrappers */

export function ScaleUDim(x: number): UDim {
	return new UDim(x, 0);
}

export function ScaleUDim2(x: number, y: number): UDim2 {
	return UDim2.fromScale(x, y);
}
