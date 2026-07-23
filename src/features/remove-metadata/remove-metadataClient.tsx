"use client";

import { MetadataEditor } from "@/src/components/MetadataEditor";

export default function RemoveMetadataClient() {
  return (
    <MetadataEditor
      mode="remove"
      toolId="remove-metadata"
      title="Remove PDF Metadata"
      description="Clear all metadata and properties from a PDF document"
      actionLabel="Remove All Metadata"
    />
  );
}
