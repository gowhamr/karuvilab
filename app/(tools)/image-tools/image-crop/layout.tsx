import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image Crop Tool | KaruviLab",
  description: "Crop images to a specific aspect ratio or freeform selection, processed locally in your browser.",
  keywords: ["image crop", "crop image", "image cropper", "aspect ratio crop", "online image crop"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
