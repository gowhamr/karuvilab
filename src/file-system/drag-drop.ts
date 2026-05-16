export const handleDragOver = (e: React.DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
};

export const handleDragLeave = (e: React.DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
};

export const handleDrop = (
  e: React.DragEvent,
  onFiles: (files: File[]) => void
) => {
  e.preventDefault();
  e.stopPropagation();

  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
    onFiles(Array.from(e.dataTransfer.files));
  }
};
