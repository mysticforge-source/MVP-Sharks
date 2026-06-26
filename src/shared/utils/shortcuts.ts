/**
 * A bunch of shortcuts
 */

/**
 * UDim2.fromScale --> new Us2
 */
export class Us2 extends UDim2 {
    constructor(
        xScale: number, 
        yScale: number
    ) {
        super(xScale,0, yScale, 0);
    }
};

export class V2 extends Vector2 {
    constructor(
        x: number, 
        y: number
    ) {
        super(x, y);
    }
};

export class V3 extends Vector3 {
    constructor(
        x: number,
        y: number,
        z: number,
    ) {
        super(x, y, z);
    }
};

export class Col3 extends Color3 {
    constructor(
        R?: number,
        G?: number,
        B?: number
    ) {
        super(
            R ?? 0,
            G ?? R ?? 0,
            B ?? G ?? R ?? 0,
        )
    }
};
