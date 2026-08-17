import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useBatchStore } from '../store/useBatchStore';
describe('useBatchStore', () => {
    beforeEach(() => {
        useBatchStore.setState({ items: {} });
    });
    it('should add items to the queue', () => {
        const files = [
            new File(['test1'], 'test1.txt'),
            new File(['test2'], 'test2.txt'),
        ];
        useBatchStore.getState().addItems('test-tool', files);
        const items = useBatchStore.getState().items['test-tool'];
        expect(items).toHaveLength(2);
        expect(items[0].file.name).toBe('test1.txt');
    });
    it('should remove items from the queue', () => {
        const files = [new File(['test1'], 'test1.txt')];
        useBatchStore.getState().addItems('test-tool', files);
        const itemId = useBatchStore.getState().items['test-tool'][0].id;
        useBatchStore.getState().removeItem('test-tool', itemId);
        expect(useBatchStore.getState().items['test-tool']).toHaveLength(0);
    });
    it('should process items in parallel', async () => {
        const files = [
            new File(['test1'], 'test1.txt'),
            new File(['test2'], 'test2.txt'),
        ];
        useBatchStore.getState().addItems('test-tool', files);
        const processor = vi.fn().mockResolvedValue({ success: true });
        await useBatchStore.getState().startProcessing('test-tool', processor);
        const items = useBatchStore.getState().items['test-tool'];
        expect(items[0].status).toBe('completed');
        expect(items[1].status).toBe('completed');
        expect(processor).toHaveBeenCalledTimes(2);
    });
    it('should handle failures gracefully', async () => {
        const files = [new File(['test1'], 'test1.txt')];
        useBatchStore.getState().addItems('test-tool', files);
        const processor = vi.fn().mockRejectedValue(new Error('Process failed'));
        await useBatchStore.getState().startProcessing('test-tool', processor);
        const items = useBatchStore.getState().items['test-tool'];
        expect(items[0].status).toBe('failed');
        expect(items[0].error).toBe('Process failed');
    });
});
