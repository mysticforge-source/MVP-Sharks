/* a bunch of shortcuts */

/* udim2.fromscale wrapper */
export class Us2 extends UDim2 {
	constructor(xScale: number, yScale: number) {
		return new UDim2(xScale, 0, yScale, 0);
		super();
	}
}

/* vector2 wrapper */
export class V2 extends Vector2 {
	constructor(x: number, y: number) {
		return new Vector2(x, y);
		super();
	}
}

/* vector3 wrapper */
export class V3 extends Vector3 {
	constructor(x: number, y: number, z: number) {
		return new Vector3(x, y, z);
		super();
	}
}

/* color3 wrapper */
export class Col3 extends Color3 {
	constructor(R?: number, G?: number, B?: number) {
		return new Color3(R ?? 0, G ?? R ?? 0, B ?? G ?? R ?? 0);
		super();
	}
}
