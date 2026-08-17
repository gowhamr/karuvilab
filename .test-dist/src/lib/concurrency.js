/**
 * Simple concurrency limiter to prevent main thread/memory explosion.
 */
export async function limitConcurrency(items, limit, fn) {
    const results = new Array(items.length);
    const queue = items.map((item, index) => ({ item, index }));
    const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
        while (queue.length > 0) {
            const { item, index } = queue.shift();
            results[index] = await fn(item);
        }
    });
    await Promise.all(workers);
    return results;
}
