import { useEffect, useRef } from 'react';
import { safePut, safeGet, safeDelete } from '@/src/lib/db';
import { useRecoveryStore } from '@/src/store/useRecoveryStore';
const AUTOSAVE_DELAY = 1500;
export function useAutoSave(key, data, onRestore, sanitizeForSave = (d) => d, validateForRestore = () => true) {
    const onRestoreRef = useRef(onRestore);
    const dataRef = useRef(data);
    const showBanner = useRecoveryStore(s => s.showBanner);
    const initialized = useRef(false);
    useEffect(() => {
        onRestoreRef.current = onRestore;
        dataRef.current = data;
    }, [onRestore, data]);
    // Check for existing session on mount
    useEffect(() => {
        async function checkSession() {
            if (initialized.current)
                return;
            initialized.current = true;
            const snapshot = await safeGet('tool-states', key);
            if (snapshot && snapshot.state) {
                // Exclude stale blob URLs, etc. by using validateForRestore
                if (validateForRestore(snapshot.state)) {
                    showBanner('dirty_session', 'Unsaved work detected from your last session.', {
                        label: 'Restore',
                        onClick: () => {
                            onRestoreRef.current(snapshot.state);
                            safeDelete('tool-states', key); // Clear after restore
                        }
                    });
                }
                else {
                    // If validation fails, discard snapshot
                    safeDelete('tool-states', key);
                }
            }
        }
        checkSession();
    }, [key, showBanner, validateForRestore]);
    // Debounced auto-save
    useEffect(() => {
        if (!initialized.current)
            return;
        const handler = setTimeout(() => {
            const sanitized = sanitizeForSave(dataRef.current);
            if (sanitized) {
                safePut('tool-states', {
                    toolId: key,
                    state: sanitized,
                    updatedAt: Date.now()
                });
            }
        }, AUTOSAVE_DELAY);
        return () => clearTimeout(handler);
    }, [data, key, sanitizeForSave]);
}
