'use client';
import { useEffect } from 'react';
import { getStorageStats, clearOldCache } from '../db';
import { useToast } from '@/components/ui/Toast';
const QUOTA_THRESHOLD = 0.8; // 80%
/**
 * Monitors IndexedDB storage usage and alerts the user if they are near their quota.
 * Also performs automatic cleanup of old cache files.
 */
export function useStorageMonitor() {
    const { toast } = useToast();
    useEffect(() => {
        async function monitorStorage() {
            try {
                // 1. Automatic cleanup of entries older than 7 days
                await clearOldCache();
                // 2. Check current quota
                const stats = await getStorageStats();
                if (stats.percent > QUOTA_THRESHOLD * 100) {
                    toast(`KaruviLab is using ${Math.round(stats.percent)}% of your available local storage. You might want to clear your tool history in Settings to prevent failures.`, 'warn');
                }
            }
            catch (error) {
                console.error('Storage monitoring failed:', error);
            }
        }
        monitorStorage();
    }, [toast]);
}
