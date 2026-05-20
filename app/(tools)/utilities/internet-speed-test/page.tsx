import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";
import InternetSpeedTestClient from "./InternetSpeedTestClient";

const toolId = "internet-speed-test";
const cat = CATEGORIES.find((c) => c.id === "utilities")!;

export const metadata: Metadata = generateToolMetadata(toolId);

export default function InternetSpeedTestPage() {
  return (
    <ToolShell
      title="Internet Speed Test"
      description="Professional-grade internet diagnostic tool. High-precision measurement of bandwidth, latency, and connection stability."
      category={cat}
      toolId={toolId}
      content={{
        detailedDescription: "KaruviLab Speed Test provides professional-grade network diagnostics entirely within your browser. Using adaptive multithreading and local-only processing, we measure your true bandwidth capacity without the overhead of third-party tracking pixels. Our analysis includes 'Loaded Latency' to detect bufferbloat—a critical factor for gaming and video calls.",
        useCases: [
          "Verifying ISP bandwidth against promised speeds",
          "Diagnosing gaming lag and jitter issues",
          "Testing 4K streaming readiness for Netflix/YouTube",
          "Optimizing home office setup for video conferencing",
          "Checking mobile data performance in different locations"
        ],
        howTo: [
          "Click the 'Start' button to begin the diagnostic suite.",
          "Wait for the Ping and Jitter tests to establish connection baseline.",
          "Monitor the real-time gauge during the Download phase.",
          "Observe the stability chart during the Upload phase.",
          "Review your 'Connection Grade' and share the result if needed."
        ],
        faq: [
          {
            question: "Why is my speed lower than my ISP's promise?",
            answer: "Network speeds are affected by many factors: Wi-Fi signal strength, router hardware, time of day (congestion), and protocol overhead (TCP/IP usually takes 5-10%)."
          },
          {
            question: "What is Jitter?",
            answer: "Jitter is the variance in latency over time. Low jitter (under 10ms) is essential for smooth video calls and online gaming, as it ensures packets arrive in a steady rhythm."
          },
          {
            question: "What is Loaded Latency?",
            answer: "Loaded Latency (or Bufferbloat) measures your ping while your connection is busy downloading or uploading. A high jump in ping under load indicates poor network management by your router or ISP."
          },
          {
            question: "Is this test private?",
            answer: "Yes. Unlike most speed tests, KaruviLab doesn't use third-party tracking or upload your IP to a public database. All calculations happen locally."
          }
        ],
        relatedTools: ["data-calculator", "world-clock", "time-calculator"]
      }}
    >
      <InternetSpeedTestClient />
    </ToolShell>
  );
}
