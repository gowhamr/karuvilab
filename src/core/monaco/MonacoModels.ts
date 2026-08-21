import type { Monaco } from '@monaco-editor/react';

/**
 * KaruviLab Monaco Model Manager
 * Prevents continuous recreation of editor models, preserving undo history,
 * IntelliSense context, cross-file references, and diagnostics.
 */

export class MonacoModelManager {
  private static activeReferences = new Map<string, number>();

  /**
   * Generates a stable URI for a KaruviLab asset.
   */
  public static getUri(monacoInstance: Monaco, uriPath: string) {
    return monacoInstance.Uri.parse(`kv://${uriPath.startsWith('/') ? uriPath.slice(1) : uriPath}`);
  }

  /**
   * Get an existing model by URI.
   */
  public static getModel(monacoInstance: Monaco, uriPath: string) {
    const uri = this.getUri(monacoInstance, uriPath);
    return monacoInstance.editor.getModel(uri);
  }

  /**
   * Create a new model, replacing an existing one if necessary.
   */
  public static createModel(
    monacoInstance: Monaco,
    value: string,
    language: string,
    uriPath: string
  ) {
    const uri = this.getUri(monacoInstance, uriPath);
    let model = monacoInstance.editor.getModel(uri);
    
    if (model) {
      model.dispose();
    }
    
    return monacoInstance.editor.createModel(value, language, uri);
  }

  /**
   * Get or create a stable model for a given URI.
   */
  public static getOrCreateModel(
    monacoInstance: Monaco,
    value: string,
    language: string,
    uriPath: string
  ) {
    const uri = this.getUri(monacoInstance, uriPath);
    let model = monacoInstance.editor.getModel(uri);

    if (!model) {
      model = monacoInstance.editor.createModel(value, language, uri);
    } else {
      // Ensure language is correct
      if (model.getLanguageId() !== language) {
         monacoInstance.editor.setModelLanguage(model, language);
      }
    }

    // Track reference count
    const uriString = uri.toString();
    this.activeReferences.set(uriString, (this.activeReferences.get(uriString) || 0) + 1);

    return model;
  }

  /**
   * Gently update a model's value, preserving undo stack.
   */
  public static updateModel(
    model: any, // using any to avoid importing specific Monaco type here, though we could
    value: string
  ) {
    if (model.getValue() !== value) {
       model.setValue(value);
    }
  }

  /**
   * Dispose a specific model.
   */
  public static disposeModel(monacoInstance: Monaco, uriPath: string) {
    const uri = this.getUri(monacoInstance, uriPath);
    const model = monacoInstance.editor.getModel(uri);
    if (model) {
      model.dispose();
    }
    this.activeReferences.delete(uri.toString());
  }

  /**
   * Release a reference to a model. If references hit 0, it can be disposed by disposeUnusedModels.
   */
  public static releaseModelReference(monacoInstance: Monaco, uriPath: string) {
    const uri = this.getUri(monacoInstance, uriPath);
    const uriString = uri.toString();
    const count = this.activeReferences.get(uriString) || 0;
    if (count > 0) {
      this.activeReferences.set(uriString, count - 1);
    }
  }

  /**
   * Dispose models that have 0 active references.
   */
  public static disposeUnusedModels(monacoInstance: Monaco) {
    const models = monacoInstance.editor.getModels();
    models.forEach((model: { uri: { toString: () => string }, dispose: () => void }) => {
      const uriString = model.uri.toString();
      if (uriString.startsWith('kv://') && (this.activeReferences.get(uriString) || 0) === 0) {
        model.dispose();
      }
    });
  }

  /**
   * Clean up all models to prevent memory leaks
   */
  public static disposeAll(monacoInstance: Monaco) {
    const models = monacoInstance.editor.getModels();
    models.forEach((model: { dispose: () => void }) => model.dispose());
    this.activeReferences.clear();
  }

  /**
   * Get metrics about current models.
   */
  public static getModelStats(monacoInstance: Monaco) {
    const models = monacoInstance.editor.getModels();
    return {
      totalModels: models.length,
      kvModels: models.filter((m: any) => m.uri.toString().startsWith('kv://')).length,
      activeReferences: Object.fromEntries(this.activeReferences),
    };
  }
}
