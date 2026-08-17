// src/tool-engine/hooks/useFileInput.ts
import { useCallback } from "react";
import { useToolStore } from "../store/toolStore";
export function useFileInput(validation) {
    const setDragState = useToolStore(s => s.setDragState);
    const setError = useToolStore(s => s.setError);
    const validateFiles = useCallback((files) => {
        // Basic validation
        if (validation.maxFiles && files.length > validation.maxFiles) {
            setError(`Maximum ${validation.maxFiles} files allowed.`);
            setDragState("rejected");
            return false;
        }
        if (validation.formats && validation.formats.length > 0) {
            const allowedExts = validation.formats.map(f => `.${f.toLowerCase()}`);
            const hasInvalidFormat = files.some(file => {
                const name = file.name.toLowerCase();
                return !allowedExts.some(ext => name.endsWith(ext));
            });
            if (hasInvalidFormat) {
                setError(`Invalid file format. Allowed: ${validation.formats.join(", ")}`);
                setDragState("rejected");
                return false;
            }
        }
        if (validation.maxSizeMB) {
            const maxBytes = validation.maxSizeMB * 1024 * 1024;
            const hasLargeFile = files.some(f => f.size > maxBytes);
            if (hasLargeFile) {
                setError(`File size exceeds limit of ${validation.maxSizeMB}MB.`);
                setDragState("rejected");
                return false;
            }
        }
        // Custom validation from config
        if (validation.validate) {
            const customError = validation.validate(files);
            if (customError) {
                setError(customError);
                setDragState("rejected");
                return false;
            }
        }
        return true;
    }, [validation, setError, setDragState]);
    return { validateFiles };
}
