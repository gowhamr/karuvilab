import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { ToolInfoSection } from "@/components/ui/ToolInfoSection";
import { generateToolMetadata } from "@/src/lib/seo";
import InternetSpeedTestClientWrapper from "./InternetSpeedTestClientWrapper";

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
      <InternetSpeedTestClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-bufferbloat"
          title="How it Works: Bufferbloat and Latency"
          preview="Learn why having Gigabit internet doesn't guarantee you won't lag in video games."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              Many people upgrade to Gigabit fiber internet hoping it will fix their lagging video games or stuttering Zoom calls, only to be disappointed. That's because high bandwidth (megabits per second) measures <em>throughput</em>, not <em>responsiveness</em>.
            </p>
            <h3>Latency vs Loaded Latency</h3>
            <p>
              <strong>Unloaded Latency (Ping)</strong> measures how long it takes a data packet to reach the server when your network is idle.
            </p>
            <p>
              <strong>Loaded Latency (Bufferbloat)</strong> measures your ping while a large file download or upload is happening simultaneously on your network.
            </p>
            <h3>What causes Bufferbloat?</h3>
            <p>
              When network traffic surges, routers queue packets in a "buffer" to prevent dropping them. However, older or poorly configured routers use huge, unmanaged buffers. When someone in the house starts watching 4K Netflix, the router stuffs the buffer full of video data. Your tiny, time-sensitive gaming packets (or Zoom audio packets) get stuck at the back of this massive line, causing your latency to spike from 20ms to 400ms.
            </p>
            <p>
              Modern routers fix this using SQM (Smart Queue Management), which ensures time-sensitive packets skip the line, keeping your Loaded Latency identical to your Unloaded Latency.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
