/**
 * KaruviLab (KV) Background Removal Engine Registry
 * Central registry managing all available background removal engines.
 */
import { InstantCanvasEngine } from './engines/instant-canvas.engine';
import { U2NetPEngine } from './engines/u2netp.engine';
import { RMBGEngine } from './engines/rmbg.engine';
import { analyzeImageForRemoval } from './engine-selector';
export class EngineRegistry {
    engines = new Map();
    constructor() {
        this.register(new InstantCanvasEngine());
        this.register(new U2NetPEngine());
        this.register(new RMBGEngine());
    }
    register(engine) {
        this.engines.set(engine.id, engine);
    }
    get(id) {
        // Support convenient aliases
        if (id === 'canvas' || id === 'instant-canvas') {
            const e = this.engines.get('instant-canvas');
            if (e)
                return e;
        }
        if (id === 'u2netp' || id === 'u2netp-mobile') {
            const e = this.engines.get('u2netp-mobile');
            if (e)
                return e;
        }
        if (id === 'rmbg' || id === 'background-removal-rmbg') {
            const e = this.engines.get('background-removal-rmbg');
            if (e)
                return e;
        }
        const direct = this.engines.get(id);
        if (!direct) {
            // Fallback to u2netp
            const fallback = this.engines.get('u2netp-mobile') || Array.from(this.engines.values())[0];
            if (!fallback)
                throw new Error(`No removal engine available for id: ${id}`);
            return fallback;
        }
        return direct;
    }
    list() {
        return Array.from(this.engines.values());
    }
    getOptimalEngine(imageElement, clientOptions) {
        const recommendation = analyzeImageForRemoval(imageElement, clientOptions);
        const engine = this.get(recommendation.engine);
        return { engine, recommendation };
    }
}
export const removalEngineRegistry = new EngineRegistry();
