import { useState, useEffect } from 'react';
let registryCache = null;
let registryPromise = null;
export function useToolRegistry() {
    const [tools, setTools] = useState(registryCache || []);
    useEffect(() => {
        if (registryCache)
            return;
        if (!registryPromise) {
            // Dynamically import the core tools to prevent bundle bloat
            registryPromise = import('@/src/registry/core-registry').then(m => {
                registryCache = m.CORE_TOOLS;
                return m.CORE_TOOLS;
            });
        }
        registryPromise.then(res => {
            setTools(res);
        });
    }, []);
    return tools;
}
