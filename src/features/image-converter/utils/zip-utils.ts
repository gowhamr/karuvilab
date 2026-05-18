import { workerManager } from "../../../workers/manager";
import { BatchItem } from "@/src/store/useBatchStore";

export async function createBatchZip(
  items: BatchItem[],
  onProgress?: (p: { percent: number; message: string }) => void
): Promise<Uint8Array> {
  const completedItems = items.filter(i => i.status === 'completed' && i.result);
  
  if (completedItems.length === 0) {
    throw new Error("No completed items to zip");
  }

  const zipData: Record<string, Uint8Array> = {};
  
  onProgress?.({ percent: 10, message: "Preparing files for ZIP..." });

  for (let i = 0; i < completedItems.length; i++) {
    const item = completedItems[i]!;
    const buffer = await item.result!.blob.arrayBuffer();
    zipData[item.result!.name] = new Uint8Array(buffer);
    
    onProgress?.({ 
      percent: 10 + (i / completedItems.length) * 40, 
      message: `Adding ${item.result!.name} to archive...` 
    });
  }

  onProgress?.({ percent: 60, message: "Generating ZIP archive in worker..." });
  
  const result = await workerManager.runZip(zipData, (p) => {
    onProgress?.({ 
      percent: 60 + (p.percent * 0.4), 
      message: p.message || "Zipping..." 
    });
  });

  onProgress?.({ percent: 100, message: "ZIP ready!" });
  return result;
}
