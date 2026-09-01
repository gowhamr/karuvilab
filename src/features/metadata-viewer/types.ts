export interface PrivacyFinding {
  level: 'high' | 'medium' | 'low';
  field: string;
  value: string;
  description: string;
}

export interface MetadataDocument {
  file: {
    name: string;
    sizeBytes: number;
    lastModified: number;
    extensionClaimed: string;
    mimeClaimed: string;
  };
  forensics: {
    magicBytes: string;
    detectedFormat: string;
    detectedMime: string;
    isExtensionConsistent: boolean;
  };
  technical: Record<string, string | number | boolean>;
  namespaces: {
    exif?: Record<string, any>;
    xmp?: Record<string, any>;
    iptc?: Record<string, any>;
  };
  privacy: PrivacyFinding[];
}
