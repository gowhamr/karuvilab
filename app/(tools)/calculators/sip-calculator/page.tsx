import SIPCalculatorClientWrapper from "./SIPCalculatorClientWrapper";
import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";

const cat = CATEGORIES.find((c) => c.id === "calculators")!;
const staticMeta = generateToolMetadata("sip-calculator");

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const monthly = params['monthly'];
  const rate = params['rate'];
  const years = params['years'];

  const hasSharedResult = monthly !== undefined || rate !== undefined;

  if (hasSharedResult) {
    const m = Array.isArray(monthly) ? monthly[0] : monthly;
    const r = Array.isArray(rate) ? rate[0] : rate;
    const y = Array.isArray(years) ? years[0] : years;

    const dynamicTitle = `SIP ₹${Number(m).toLocaleString('en-IN')}/mo @ ${r}% for ${y}yr — KV`;
    const dynamicDesc = `Shared SIP projection: ₹${Number(m).toLocaleString('en-IN')}/month at ${r}% p.a. for ${y} years. See the full result on KaruviLab.`;

    return {
      ...staticMeta,
      title: dynamicTitle,
      description: dynamicDesc,
      openGraph: {
        ...(typeof staticMeta.openGraph === 'object' && !Array.isArray(staticMeta.openGraph) ? staticMeta.openGraph : {}),
        title: dynamicTitle,
        description: dynamicDesc,
      },
      twitter: {
        ...(typeof staticMeta.twitter === 'object' ? staticMeta.twitter : {}),
        title: dynamicTitle,
        description: dynamicDesc,
      },
    };
  }

  return staticMeta;
}

export default function SipCalculator() {
  return (
    <ToolShell
      title="SIP Calculator"
      description="Project your mutual fund SIP returns with step-up, lumpsum, and custom adjustments."
      category={cat}
      content={{
        detailedDescription: "The SIP (Systematic Investment Plan) Calculator is designed to help investors estimate the future value of their mutual fund investments with precision. Beyond basic projections, this tool includes advanced adjustment options for tax, inflation, and management fees. By accounting for these real-world factors, you get a much clearer picture of your 'Net Take-home' wealth. Whether you're planning for retirement or a specific financial milestone, these adjustments help bridge the gap between gross projections and actual purchasing power.",
        howTo: [
          "Enter your intended monthly investment amount (SIP).",
          "Input the expected annual rate of return.",
          "Choose the total duration of your investment in years.",
          "Open 'Adjustments' to set custom tax, inflation, and fee rates.",
          "Review the Net Value and Inflation-Adjusted returns for a realistic outlook."
        ],
        faq: [
          {
            question: "Why should I include tax and fees?",
            answer: "Management fees (expense ratio) and capital gains tax can significantly impact your final corpus. Including them provides a more accurate net wealth projection."
          },
          {
            question: "How does inflation affect my returns?",
            answer: "Inflation reduces the purchasing power of money. The inflation-adjusted value shows what your future corpus would be worth in 'today's' currency value."
          }
        ],
        relatedTools: ["compound-interest", "emi-calculator", "percentage-calculator"]
      }}
    >
      <SIPCalculatorClientWrapper />
    </ToolShell>
  );
}
