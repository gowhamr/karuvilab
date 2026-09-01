import { ToolEntry } from '../types';

export const metadataViewer: ToolEntry = {
  id: "metadata-viewer",
  name: "Metadata Viewer",
  desc: "Inspect file forensics, magic signatures, EXIF data, and privacy warnings entirely offline.",
  href: "/security-tools/metadata-viewer/",
  category: "security",
  keywords: ["metadata", "exif", "forensics", "privacy", "file"],
  related: ["hash-generator"],
  priority: 0.8,
  status: "new"
};
