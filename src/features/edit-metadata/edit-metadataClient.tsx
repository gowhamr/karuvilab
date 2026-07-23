"use client";

import { MetadataEditor } from "@/src/components/MetadataEditor";

export default function EditMetadataClient() {
  return (
    <MetadataEditor
      mode="edit"
      toolId="edit-metadata"
      title="Edit PDF Metadata"
      description="View and edit PDF properties like Title, Author, and Subject"
      actionLabel="Update Metadata"
    />
  );
}
