/**
 * Centralized object URL manager to prevent memory leaks.
 */
import { blobManager } from '@/src/lib/blob-manager';
class ObjectUrlManager {
    urls = new Set();
    create(blob) {
        const url = blobManager.create(blob);
        this.urls.add(url);
        return url;
    }
    revoke(url) {
        if (this.urls.has(url)) {
            blobManager.revoke(url);
            this.urls.delete(url);
        }
    }
    revokeAll() {
        this.urls.forEach(url => blobManager.revoke(url));
        this.urls.clear();
    }
}
export const objectUrlManager = new ObjectUrlManager();
import { useEffect, useState } from "react";
export const useObjectUrl = (blob) => {
    const [url, setUrl] = useState(null);
    useEffect(() => {
        let active = true;
        let newUrl = null;
        if (blob) {
            newUrl = objectUrlManager.create(blob);
            const urlToSet = newUrl;
            Promise.resolve().then(() => {
                if (active)
                    setUrl(urlToSet);
            });
        }
        else {
            Promise.resolve().then(() => {
                if (active)
                    setUrl(null);
            });
        }
        return () => {
            active = false;
            if (newUrl) {
                objectUrlManager.revoke(newUrl);
            }
        };
    }, [blob]);
    return url;
};
