import { useEffect, useCallback } from 'react';
import { blobManager } from '../blob-manager';
/**
 * Hook to manage a Blob URL that should be revoked when the component unmounts.
 */
export function useBlobUrl() {
    const createUrl = useCallback((blob) => {
        return blobManager.create(blob);
    }, []);
    const revokeUrl = useCallback((url) => {
        blobManager.revoke(url);
    }, []);
    return { createUrl, revokeUrl };
}
/**
 * Use this for a single URL that strictly belongs to the component lifecycle.
 */
export function useAutoRevokeBlobUrl(url) {
    useEffect(() => {
        return () => {
            if (url) {
                blobManager.revoke(url);
            }
        };
    }, [url]);
}
