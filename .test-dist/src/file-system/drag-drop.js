export const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
};
export const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
};
export const handleDrop = (e, onFiles) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        onFiles(Array.from(e.dataTransfer.files));
    }
};
