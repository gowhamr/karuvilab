import { Metadata } from "next";
import HomeClient from "./HomeClient";
import { StructuredData } from "@/src/lib/seo";

export const metadata: Metadata = {
  title: "KaruviLab — Fast, Private Browser Tools",
  description: "The world's fastest, most private browser-side toolkit. No uploads. No tracking. 100% local-first tools for developers, designers, and daily tasks.",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <>
      <StructuredData />
      <HomeClient />
    </>
  );
}
