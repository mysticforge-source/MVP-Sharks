/*
 * Pool object to pool repetitive instances
 */
export class Pool {
    private pool = new Array<Instance>;

    // Adds object and cloneAmount of it's copies into the pool
    protected add(
        object: Instance,
        cloneAmount?: number
    ) {
        for (let i = 1; i < (cloneAmount ?? 1); i++) {
            const obj = object.Clone();
            this.pool.push(obj);
        };
        this.pool.push(object);
    }

    // Retrieves an object from the pool
    protected get() {
        return this.pool.pop()
    }

    // Maid compatibility
    protected Destroy() {
        this.pool.clear()
    }
}
