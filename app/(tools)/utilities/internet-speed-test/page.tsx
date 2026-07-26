import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";
import InternetSpeedTestClientWrapper from "./InternetSpeedTestClientWrapper";
import { LearningHub, LearningSection } from "@/src/components/els/LearningHub";
import { QuizWidget } from "@/src/components/els/QuizWidget";

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
    >
      <InternetSpeedTestClientWrapper />

      <LearningHub title="Understanding Latency and Bufferbloat">
        
        <LearningSection type="architecture" title="Throughput vs Responsiveness">
          <p>Many people upgrade to Gigabit fiber internet hoping it will fix their lagging video games or stuttering Zoom calls, only to be disappointed. That's because high bandwidth (megabits per second) measures <em>Throughput</em> (how much data fits in the pipe), not <em>Responsiveness</em> (how fast data travels through the pipe).</p>
        </LearningSection>
        
        <LearningSection type="api" title="Unloaded vs Loaded Latency">
          <p><strong>Unloaded Latency (Ping)</strong> measures how long it takes a data packet to reach the server when your network is completely idle.</p>
          <p className="mt-2"><strong>Loaded Latency (Bufferbloat)</strong> measures your ping while a large file download or upload is happening simultaneously on your network. A massive jump between Unloaded and Loaded latency indicates a severe router configuration problem.</p>
        </LearningSection>

        <LearningSection type="performance" title="What causes Bufferbloat?">
          <p>When network traffic surges, routers queue packets in a "buffer" to prevent dropping them.</p>
          <p className="mt-2">However, older or poorly configured routers use huge, unmanaged buffers. When someone in the house starts watching 4K Netflix, the router stuffs the buffer full of massive video data packets. Your tiny, time-sensitive gaming packets (or Zoom audio packets) get stuck at the back of this massive line.</p>
          <p className="mt-2">As a result, your latency spikes from a smooth 20ms to a game-breaking 400ms.</p>
        </LearningSection>

        <LearningSection type="security" title="The Solution: SQM">
          <p>Modern routers fix Bufferbloat using SQM (Smart Queue Management). SQM algorithms (like fq_codel or CAKE) automatically manage the buffer, ensuring that small, time-sensitive packets skip the line, keeping your Loaded Latency nearly identical to your Unloaded Latency.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "If you have a 1 Gigabit connection but your 'Loaded Latency' is 300ms, what will be your experience in an online video game while someone else is downloading a large file?",
                options: [
                  "Perfect. Gigabit internet guarantees no lag.",
                  "Terrible. The game will lag severely because your gaming packets are stuck behind the download packets in the router's buffer.",
                  "Slightly slow, but playable.",
                  "The game will disconnect entirely."
                ],
                correctIndex: 1,
                explanation: "Bandwidth (Gigabit) does not prevent latency. If the router suffers from bufferbloat, your time-sensitive gaming packets will be delayed, causing severe lag."
              },
              {
                question: "What router technology is designed specifically to fix Bufferbloat?",
                options: [
                  "Wi-Fi 6",
                  "WPA3 Encryption",
                  "SQM (Smart Queue Management)",
                  "Port Forwarding"
                ],
                correctIndex: 2,
                explanation: "SQM intelligently manages packet queues so that time-sensitive traffic (voice, gaming) isn't blocked by bulk downloads."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
