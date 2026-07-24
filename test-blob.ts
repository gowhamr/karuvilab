const zipped: Uint8Array<ArrayBufferLike> = new Uint8Array(10);
const blob1 = new Blob([zipped.buffer as ArrayBuffer]);
const blob2 = new Blob([zipped as unknown as BlobPart]);
