import { ToolContent } from '../../registry/types';

export const internetSpeedTest: ToolContent = {
  detailedDescription:
    "Measure your internet connection speed — including download, upload, and ping latency — using a private, browser-side tester. Unlike many popular speed tests, this utility does not use intrusive tracking or persistent cookies. It performs direct requests to reliable global endpoints to provide an accurate real-time assessment of your network quality.",
  howTo: [
    "Click the 'Start Test' button to begin the measurement process.",
    "The tool will first measure your Ping (latency) and Jitter.",
    "Next, it will perform multiple download segments to calculate your Mbps.",
    "Finally, it will test your upload speed by sending a small amount of data.",
    "Once finished, your results will be displayed prominently.",
  ],
  faq: [
    {
      question: "How does this test work?",
      answer:
        "The tool fetches assets of known sizes from global CDNs and measures the time taken to complete the transfer. Download speed is calculated based on the bits received per second, and upload is measured by sending data to an endpoint.",
    },
    {
      question: "Is it as accurate as dedicated speed test sites?",
      answer:
        "It provides a very high degree of accuracy for typical browser-based connections. However, because it runs entirely in the browser, results may be slightly affected by browser extensions or other tabs. For professional network certification, specialized hardware or CLI tools are recommended.",
    },
    {
      question: "What is Jitter?",
      answer:
        "Jitter measures the consistency of your latency (ping). High jitter can cause performance issues in real-time applications like video conferencing or online gaming, even if your average ping is low.",
    },
    {
      question: "Why do I get different results in different browsers?",
      answer:
        "Each browser has its own networking stack and resource management policies. Factors like caching, background tasks, and extension interference can cause slight variations in measured speed.",
    },
  ],
  useCases: [
    "Verifying your ISP's promised connection speed",
    "Troubleshooting slow video calls or streaming issues",
    "Testing VPN performance before and after connection",
    "Checking Wi-Fi dead zones in your home or office",
  ],
  alternatives: ["Speedtest.net", "Fast.com", "Cloudflare Speed Test"],
};
