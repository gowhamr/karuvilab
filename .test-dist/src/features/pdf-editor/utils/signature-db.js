import { getPreference, setPreference } from '@/src/lib/db';
export async function getSignature() {
    try {
        const local = localStorage.getItem('karuvilab_signature');
        if (local) {
            // Migrate from localStorage to IndexedDB
            await setPreference('karuvilab_signature', local);
            localStorage.removeItem('karuvilab_signature');
            return local;
        }
        return (await getPreference('karuvilab_signature'));
    }
    catch (error) {
        // Cannot use logger from here easily without import cycle or we can just ignore
        return null;
    }
}
export async function setSignature(dataUrl) {
    try {
        await setPreference('karuvilab_signature', dataUrl);
    }
    catch (error) {
        // Ignore error
    }
}
