/*
 * pool object to pool repetitive instances
 */
export class Pool {
	private pool = new Array<Instance>();

	/* adds object and cloneamount of its copies into the pool */
	protected add(object: Instance, cloneAmount?: number) {
		for (let i = 1; i < (cloneAmount ?? 1); i++) {
			const obj = object.Clone();
			this.pool.push(obj);
		}
		this.pool.push(object);
	}

	/* retrieves an object from the pool */
	protected get() {
		return this.pool.pop();
	}

	/* maid compatibility */
	protected Destroy() {
		this.pool.clear();
	}
}
